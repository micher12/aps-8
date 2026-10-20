import { LedgerKpis } from '@/components/ui/ledger-kpis';

interface MonitoramentosKpisProps {
    totais: { agua: number; energia: number; co2: number };
    isPending: boolean;
}

export function MonitoramentosKpis({ totais, isPending }: MonitoramentosKpisProps) {
    const texto = (n: number, digitos: number) =>
        isPending ? '—' : n.toLocaleString('pt-BR', { maximumFractionDigits: digitos });

    return (
        <LedgerKpis
            colunas={3}
            items={[
                {
                    codigo: 'Água · m³',
                    rotulo: 'Água total monitorada',
                    valor: texto(totais.agua, 1),
                    fonte: 'Recursos hídricos consumidos',
                    estado: 'ok',
                },
                {
                    codigo: 'Energia · kWh',
                    rotulo: 'Energia elétrica',
                    valor: texto(totais.energia, 0),
                    fonte: 'Eficiência energética apurada',
                    estado: 'ok',
                },
                {
                    codigo: 'CO₂ · kg',
                    rotulo: 'Emissões CO₂',
                    valor: texto(totais.co2, 0),
                    fonte: 'Pegada de carbono calculada',
                    estado: 'ok',
                },
            ]}
        />
    );
}
