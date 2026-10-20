import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';

interface NcHeaderProps {
    podeEscrever: boolean;
    onRegistrar: () => void;
}

export function NcHeader({ podeEscrever, onRegistrar }: NcHeaderProps) {
    return (
        <PageHeader
            protocolo="Corretiva · NC"
            titulo="Não Conformidades"
            descricao="Auditorias, controle de gravidade e fluxo de ações corretivas (ISO 14001)"
            acao={
                podeEscrever ? (
                    <Button onClick={onRegistrar} className="pressable gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Registrar NC
                    </Button>
                ) : undefined
            }
        />
    );
}
