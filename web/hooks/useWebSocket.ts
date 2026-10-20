'use client';

import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { isAutenticado } from '@/lib/auth';

export interface AlertaTempoReal {
    tipo: string;
    mensagem: string;
    organizacaoId: number;
    timestamp: string;
}

interface MonitoramentoEvento {
    tipoMedicao: string;
    valor: number;
    unidade: string;
    organizacaoId: number;
    timestamp: string;
}

/**
 * Hook central do WebSocket (SRP, DIP: telas consomem este hook, nunca a conexão direta).
 * Assina /topic/alertas, opcionalmente /topic/monitoramentos/{orgId} e /topic/queimadas.
 * O cookie httpOnly da sessão acompanha o handshake automaticamente (mesma origem).
 */
export function useWebSocketListeners(organizacaoId?: number) {
    const [conectado, setConectado] = useState(false);
    const [alertas, setAlertas] = useState<AlertaTempoReal[]>([]);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!isAutenticado()) return;

        const socket = new SockJS('/ws', null, {
            transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
        });
        const client = new Client({
            webSocketFactory: () => socket as unknown as WebSocket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            setConectado(true);

            client.subscribe('/topic/alertas', (msg) => {
                const alerta = JSON.parse(msg.body) as AlertaTempoReal;
                setAlertas((prev) => [alerta, ...prev].slice(0, 10));
            });

            if (organizacaoId) {
                client.subscribe(`/topic/monitoramentos/${organizacaoId}`, (msg) => {
                    const evento = JSON.parse(msg.body) as MonitoramentoEvento;
                    setAlertas((prev) =>
                        [
                            {
                                tipo: 'NOVA_MEDICAO',
                                mensagem: `Medição ${evento.tipoMedicao}: ${evento.valor} ${evento.unidade}`,
                                organizacaoId: evento.organizacaoId,
                                timestamp: evento.timestamp,
                            },
                            ...prev,
                        ].slice(0, 10),
                    );
                });
            }
        };

        client.onDisconnect = () => setConectado(false);
        client.onStompError = () => setConectado(false);
        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
            clientRef.current = null;
        };
    }, [organizacaoId]);

    return { conectado, alertas, desconectar: () => clientRef.current?.deactivate() };
}
