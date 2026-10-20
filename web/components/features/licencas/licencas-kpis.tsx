'use client';

import { useMemo } from 'react';
import { LedgerKpis } from '@/components/ui/ledger-kpis';
import type { Licenca } from '@/lib/types';

interface LicencasKpisProps {
    licencas?: Licenca[];
    isPending: boolean;
}

export function LicencasKpis({ licencas, isPending }: LicencasKpisProps) {
    const metricas = useMemo(() => {
        if (!licencas) return { total: 0, vencidas: 0, vencendo: 0, vigentes: 0 };
        const vencidas = licencas.filter((l) => l.vencida).length;
        const vencendo = licencas.filter((l) => !l.vencida && l.diasParaVencimento <= 30).length;
        const vigentes = licencas.filter((l) => !l.vencida && l.diasParaVencimento > 30).length;
        return { total: licencas.length, vencidas, vencendo, vigentes };
    }, [licencas]);

    const texto = (n: number) => (isPending ? '—' : String(n));

    return (
        <LedgerKpis
            items={[
                {
                    codigo: 'Cadastro',
                    rotulo: 'Total de licenças',
                    valor: texto(metricas.total),
                    fonte: 'Registradas no sistema',
                    estado: 'ok',
                },
                {
                    codigo: 'Prazo · > 30d',
                    rotulo: 'Vigentes',
                    valor: texto(metricas.vigentes),
                    fonte: 'Prazo > 30 dias',
                    estado: 'ok',
                },
                {
                    codigo: 'Prazo · ≤ 30d',
                    rotulo: 'A vencer (≤ 30d)',
                    valor: texto(metricas.vencendo),
                    fonte: 'Requer processo de renovação',
                    estado: 'atencao',
                },
                {
                    codigo: 'Prazo · vencido',
                    rotulo: 'Vencidas',
                    valor: texto(metricas.vencidas),
                    fonte: 'Risco de penalidade ou embargo',
                    estado: 'risco',
                },
            ]}
        />
    );
}
