import { LedgerKpis } from '@/components/ui/ledger-kpis';

export interface StakeholdersMetricas {
    total: number;
    orgaos: number;
    comunidade: number;
    fornecedores: number;
}

interface StakeholdersMetricasProps {
    metricas: StakeholdersMetricas;
    isPending: boolean;
}

export function StakeholdersMetricas({ metricas, isPending }: StakeholdersMetricasProps) {
    const valor = (n: number) => (isPending ? '—' : String(n));
    return (
        <LedgerKpis
            colunas={4}
            items={[
                {
                    codigo: 'Cadastro · Total',
                    rotulo: 'Total de stakeholders',
                    valor: valor(metricas.total),
                    fonte: 'Partes cadastradas',
                },
                {
                    codigo: 'Governança · Órgãos',
                    rotulo: 'Órgãos públicos',
                    valor: valor(metricas.orgaos),
                    fonte: 'SEMAD, IBAMA, Ministério Público',
                },
                {
                    codigo: 'Sociedade · Comunidade',
                    rotulo: 'Comunidade local',
                    valor: valor(metricas.comunidade),
                    fonte: 'Vizinhança e sociedade civil',
                },
                {
                    codigo: 'Cadeia · Fornecedores',
                    rotulo: 'Fornecedores',
                    valor: valor(metricas.fornecedores),
                    fonte: 'Logística e destinação',
                },
            ]}
        />
    );
}
