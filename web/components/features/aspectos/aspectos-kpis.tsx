import { LedgerKpis } from '@/components/ui/ledger-kpis';

export interface AspectosMetricas {
    total: number;
    criticos: number;
    moderados: number;
    baixos: number;
}

interface AspectosKpisProps {
    metricas: AspectosMetricas;
    isPending: boolean;
}

export function AspectosKpis({ metricas, isPending }: AspectosKpisProps) {
    const texto = (n: number) => (isPending ? '—' : String(n));

    return (
        <LedgerKpis
            items={[
                {
                    codigo: 'Cadastro',
                    rotulo: 'Aspectos mapeados',
                    valor: texto(metricas.total),
                    fonte: 'Interações ambientais registradas',
                    estado: 'ok',
                },
                {
                    codigo: 'F×G×P ≥ 60',
                    rotulo: 'Críticos',
                    valor: texto(metricas.criticos),
                    fonte: 'Exigem controle operacional rígido',
                    estado: 'risco',
                },
                {
                    codigo: 'F×G×P 36–59',
                    rotulo: 'Moderados',
                    valor: texto(metricas.moderados),
                    fonte: 'Sob monitoramento periódico',
                    estado: 'atencao',
                },
                {
                    codigo: 'F×G×P < 36',
                    rotulo: 'Baixo impacto',
                    valor: texto(metricas.baixos),
                    fonte: 'Impactos ambientais desprezíveis',
                    estado: 'ok',
                },
            ]}
        />
    );
}
