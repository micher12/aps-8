'use client';

import { useWebSocketListeners } from '@/hooks/useWebSocket';
import type { AlertaTempoReal as Alerta } from '@/hooks/useWebSocket';

/** Faixa de eventos em tempo real (canais /topic/alertas e /topic/monitoramentos). Sem Card, sem Badge pill. */
export function AlertasTempoReal({ organizacaoId }: { organizacaoId?: number }) {
    const { conectado, alertas } = useWebSocketListeners(organizacaoId);

    return (
        <section aria-label="Transmissões em tempo real" className="border-t border-border/70 pt-4">
            <div className="flex items-baseline justify-between gap-4">
                <div>
                    <p className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Tempo real · STOMP
                    </p>
                    <h2 className="mt-1 text-lg font-bold tracking-[-0.02em] text-foreground">
                        Transmissões em tempo real
                    </h2>
                </div>
                <p
                    className={`tabular shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.12em] ${
                        conectado
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-destructive'
                    }`}
                >
                    {conectado ? '● Conectado' : '○ Offline'}
                </p>
            </div>

            {alertas.length === 0 ? (
                <div className="mt-2">
                    <p className="text-sm font-medium text-foreground">
                        Nenhum evento registrado nesta sessão
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Alertas de licenciamento e novas medições transmitidas via STOMP
                        aparecerão aqui instantaneamente.
                    </p>
                </div>
            ) : (
                <ul className="mt-2 divide-y divide-border/70 border-y border-border/70">
                    {alertas.map((a: Alerta, i: number) => (
                        <li
                            key={a.timestamp + i}
                            className="flex items-baseline justify-between gap-4 py-2.5"
                        >
                            <div className="flex min-w-0 items-baseline gap-3">
                                <span className="tabular w-28 shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                                    {a.tipo.replace('_', ' ')}
                                </span>
                                <span className="truncate text-sm text-foreground">
                                    {a.mensagem}
                                </span>
                            </div>
                            <span className="tabular ml-3 shrink-0 font-mono text-[11px] text-muted-foreground">
                                {new Date(a.timestamp).toLocaleTimeString('pt-BR')}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
