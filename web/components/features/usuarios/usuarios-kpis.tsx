import { LedgerKpis } from '@/components/ui/ledger-kpis';

interface UsuariosKpisProps {
    metricas: { total: number; admin: number; gestor: number; consultor: number };
    isPending: boolean;
}

export function UsuariosKpis({ metricas, isPending }: UsuariosKpisProps) {
    const valor = (n: number) => (isPending ? '—' : String(n));
    return (
        <LedgerKpis
            colunas={4}
            items={[
                {
                    codigo: 'Cadastro · Total',
                    rotulo: 'Total de usuários',
                    valor: valor(metricas.total),
                    fonte: 'Contas cadastradas',
                },
                {
                    codigo: 'Perfil · Admin',
                    rotulo: 'Administradores',
                    valor: valor(metricas.admin),
                    fonte: 'Acesso irrestrito ao sistema',
                },
                {
                    codigo: 'Perfil · Gestor',
                    rotulo: 'Gestores ambientais',
                    valor: valor(metricas.gestor),
                    fonte: 'Governança e licenças',
                },
                {
                    codigo: 'Perfil · Consultor',
                    rotulo: 'Consultores técnicos',
                    valor: valor(metricas.consultor),
                    fonte: 'Lançamento de campo',
                },
            ]}
        />
    );
}
