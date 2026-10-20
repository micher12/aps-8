'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';

interface AspectosHeaderProps {
    podeEscrever: boolean;
    onNovo: () => void;
}

export function AspectosHeader({ podeEscrever, onNovo }: AspectosHeaderProps) {
    return (
        <PageHeader
            protocolo="Significância · F×G×P"
            titulo="Risco mapeado. Controle decide impacto."
            descricao="Matriz de avaliação de significância conforme metodologia ISO 14001 (Frequência × Gravidade × Probabilidade)"
            acao={
                podeEscrever ? (
                    <Button onClick={onNovo} className="pressable shrink-0 gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Novo Aspecto
                    </Button>
                ) : undefined
            }
        />
    );
}
