import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';

interface StakeholdersHeaderProps {
    podeEscrever: boolean;
    onNovo: () => void;
}

export function StakeholdersHeader({ podeEscrever, onNovo }: StakeholdersHeaderProps) {
    return (
        <PageHeader
            protocolo="Cláusula 4.2 · Partes interessadas"
            titulo="Partes Interessadas (Stakeholders)"
            descricao="Mapeamento, canais de comunicação e governança com a sociedade, órgãos reguladores e cadeia de suprimentos"
            acao={
                podeEscrever ? (
                    <Button onClick={onNovo} className="pressable shrink-0 gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Novo Stakeholder
                    </Button>
                ) : undefined
            }
        />
    );
}
