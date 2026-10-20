'use client';

import { useMemo } from 'react';
import { LedgerKpis } from '@/components/ui/ledger-kpis';
import type { NaoConformidade } from '@/lib/types';

interface NcMetricasProps {
    ncs: NaoConformidade[] | undefined;
    isPending: boolean;
}

export function NcMetricas({ ncs, isPending }: NcMetricasProps) {
    const metricas = useMemo(() => {
        if (!ncs) return { total: 0, abertas: 0, emTratamento: 0, resolvidas: 0 };
        const abertas = ncs.filter((n) => n.status === 'ABERTA').length;
        const emTratamento = ncs.filter((n) => n.status === 'EM_TRATAMENTO').length;
        const resolvidas = ncs.filter((n) => n.status === 'RESOLVIDA').length;
        return { total: ncs.length, abertas, emTratamento, resolvidas };
    }, [ncs]);

    const valor = (v: number) => (isPending ? '—' : String(v));

    return (
        <LedgerKpis
            items={[
                {
                    codigo: 'Total · un',
                    rotulo: 'Total Registradas',
                    valor: valor(metricas.total),
                    fonte: 'Ocorrências auditadas',
                },
                {
                    codigo: 'Abertas · un',
                    rotulo: 'Abertas (Pendentes)',
                    valor: valor(metricas.abertas),
                    fonte: 'Aguardando plano de ação',
                    estado: !isPending && metricas.abertas > 0 ? 'risco' : 'ok',
                },
                {
                    codigo: 'Tratamento · un',
                    rotulo: 'Em Tratamento',
                    valor: valor(metricas.emTratamento),
                    fonte: 'Ações corretivas em execução',
                    estado: !isPending && metricas.emTratamento > 0 ? 'atencao' : 'ok',
                },
                {
                    codigo: 'Resolvidas · un',
                    rotulo: 'Resolvidas',
                    valor: valor(metricas.resolvidas),
                    fonte: 'Conformidade restabelecida',
                },
            ]}
        />
    );
}
