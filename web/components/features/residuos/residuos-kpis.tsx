'use client';

import { useMemo } from 'react';
import { LedgerKpis } from '@/components/ui/ledger-kpis';
import type { Residuo } from '@/lib/types';

interface ResiduosKpisProps {
    residuos?: Residuo[];
    isPending: boolean;
}

export function ResiduosKpis({ residuos, isPending }: ResiduosKpisProps) {
    // Totais acumulados
    const totais = useMemo(() => {
        if (!residuos) return { totalKg: 0, perigosos: 0, infectantes: 0, naoPerigosos: 0 };
        return residuos.reduce(
            (acc, r) => {
                const pesoKg = r.unidade === 't' ? r.quantidade * 1000 : r.quantidade;
                acc.totalKg += pesoKg;
                if (r.classe === 'PERIGOSO') acc.perigosos += pesoKg;
                else if (r.classe === 'INFECTANTE') acc.infectantes += pesoKg;
                else acc.naoPerigosos += pesoKg;
                return acc;
            },
            { totalKg: 0, perigosos: 0, infectantes: 0, naoPerigosos: 0 },
        );
    }, [residuos]);

    const fmt = (v: number) => v.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    const valor = (v: number) => (isPending ? '—' : `${fmt(v)} kg`);

    return (
        <LedgerKpis
            items={[
                {
                    codigo: 'Total · kg',
                    rotulo: 'Volume Total Gerado',
                    valor: valor(totais.totalKg),
                    fonte: 'Soma de todas as classes',
                },
                {
                    codigo: 'Classe II · kg',
                    rotulo: 'Não Perigosos (Classe II)',
                    valor: valor(totais.naoPerigosos),
                    fonte: 'Recicláveis e inertes',
                },
                {
                    codigo: 'Classe I · kg',
                    rotulo: 'Perigosos (Classe I)',
                    valor: valor(totais.perigosos),
                    fonte: 'Exigem MTR e coprocessamento',
                    estado: !isPending && totais.perigosos > 0 ? 'risco' : 'ok',
                },
                {
                    codigo: 'Saúde · kg',
                    rotulo: 'Infectantes (Serv. Saúde)',
                    valor: valor(totais.infectantes),
                    fonte: 'Autoclavagem ou incineração',
                    estado: !isPending && totais.infectantes > 0 ? 'risco' : 'ok',
                },
            ]}
        />
    );
}
