import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';

interface UsuariosHeaderProps {
    onCriar: () => void;
}

export function UsuariosHeader({ onCriar }: UsuariosHeaderProps) {
    return (
        <PageHeader
            protocolo="Governança · Controle de acesso"
            titulo="Gestão de Usuários"
            descricao="Controle de contas institucionais, papéis operacionais e permissões de acesso"
            acao={
                <Button onClick={onCriar} className="pressable shrink-0 gap-2 shadow-sm">
                    <Plus className="h-4 w-4" />
                    Novo Usuário
                </Button>
            }
        />
    );
}
