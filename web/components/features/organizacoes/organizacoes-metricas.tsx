'use client';

import { useMemo } from 'react';
import { LedgerKpis } from '@/components/ui/ledger-kpis';
import type { Organizacao } from '@/lib/types';

interface OrganizacoesMetricasProps {
    organizacoes?: Organizacao[];
}

export function OrganizacoesMetricas({ organizacoes }: OrganizacoesMetricasProps) {
    const totalMunicipios = useMemo(() => {
        if (!organizacoes) return 0;
        return new Set(organizacoes.map((o) => o.municipioId).filter(Boolean)).size;
    }, [organizacoes]);

    const grandesEmpresas = useMemo(() => {
        if (!organizacoes) return 0;
        return organizacoes.filter((o) => o.porte === 'GRANDE' || o.porte === 'MEDIO').length;
    }, [organizacoes]);

    return (
        <LedgerKpis
            colunas={3}
            items={[
                {
                    codigo: 'Cadastro · un',
                    rotulo: 'Total de Organizações',
                    valor: organizacoes ? String(organizacoes.length) : '—',
                    fonte: 'Cadastradas no estado de GO',
                },
                {
                    codigo: 'Cobertura · mun',
                    rotulo: 'Municípios Atendidos',
                    valor: String(totalMunicipios),
                    fonte: 'Dos 246 municípios goianos',
                },
                {
                    codigo: 'Porte · un',
                    rotulo: 'Médio e Grande Porte',
                    valor: String(grandesEmpresas),
                    fonte: 'Exigem monitoramento contínuo',
                },
            ]}
        />
    );
}
