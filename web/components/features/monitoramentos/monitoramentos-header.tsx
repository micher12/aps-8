'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';

interface MonitoramentosHeaderProps {
    podeEscrever: boolean;
    onCriar: () => void;
}

export function MonitoramentosHeader({ podeEscrever, onCriar }: MonitoramentosHeaderProps) {
    return (
        <PageHeader
            protocolo="Série · Água / Energia / CO₂"
            titulo="Série conta. Tendência decide ação."
            descricao="Lançamento e acompanhamento de indicadores contínuos de sustentabilidade (ISO 14001)"
            acao={
                podeEscrever ? (
                    <Button onClick={onCriar} className="pressable shrink-0 gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Lançar Medição
                    </Button>
                ) : undefined
            }
        />
    );
}
