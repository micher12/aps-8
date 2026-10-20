'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { usePermissoes } from '@/lib/permissoes';

interface OrganizacoesHeaderProps {
    onNovo: () => void;
}

export function OrganizacoesHeader({ onNovo }: OrganizacoesHeaderProps) {
    const { podeEscrever } = usePermissoes();

    return (
        <PageHeader
            protocolo="Cadastro · Organizações"
            titulo="Organizações"
            descricao="Empresas e órgãos de Goiás sob governança ambiental ISO 14001"
            acao={
                podeEscrever ? (
                    <Button onClick={onNovo} className="pressable gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Nova Organização
                    </Button>
                ) : undefined
            }
        />
    );
}
