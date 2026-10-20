'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';

interface LicencasHeaderProps {
    podeEscrever: boolean;
    onCriar: () => void;
}

export function LicencasHeader({ podeEscrever, onCriar }: LicencasHeaderProps) {
    return (
        <PageHeader
            protocolo="Prazo · Licença"
            titulo="Licença em dia. Operação sem embargo."
            descricao="Controle de prazos e conformidade regulatória junto aos órgãos ambientais (SEMAD / IBAMA)"
            acao={
                podeEscrever ? (
                    <Button onClick={onCriar} className="pressable shrink-0 gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Nova Licença
                    </Button>
                ) : undefined
            }
        />
    );
}
