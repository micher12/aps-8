'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';

interface ResiduosHeaderProps {
    podeEscrever: boolean;
    onCriar: () => void;
}

export function ResiduosHeader({ podeEscrever, onCriar }: ResiduosHeaderProps) {
    return (
        <PageHeader
            protocolo="Inventário · Resíduos"
            titulo="Inventário de Resíduos"
            descricao="Rastreabilidade, classificação normativa ABNT e destinação ambiental final"
            acao={
                podeEscrever ? (
                    <Button onClick={onCriar} className="pressable gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Registrar Resíduo
                    </Button>
                ) : undefined
            }
        />
    );
}
