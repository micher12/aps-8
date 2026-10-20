'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { QueimadasBadge } from './queimadas-badge';
import { useQueimadas } from './hooks/use-queimadas';

const MapaQueimadas = dynamic(() => import('./MapaQueimadas'), {
    ssr: false,
    loading: () => <Skeleton className="h-[440px] w-full" />,
});

export function QueimadasSection() {
    const { data: queimadas } = useQueimadas();

    return (
        <section aria-label="Monitoramento de queimadas" className="border-t border-border/70 pt-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                    <p className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Orbital · NASA FIRMS
                    </p>
                    <h2 className="mt-1 text-lg font-bold tracking-[-0.02em] text-foreground">
                        Queimadas no Cerrado goiano
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Detecção térmica por satélites VIIRS / MODIS
                    </p>
                </div>
                <QueimadasBadge
                    total={queimadas?.focos.length ?? 0}
                    dadosIndisponiveis={queimadas?.dadosIndisponiveis ?? false}
                />
            </div>
            <div className="mt-3">
                <MapaQueimadas focos={queimadas?.focos ?? []} />
                <p className="mt-2 text-[11px] text-muted-foreground">
                    Pontos no mapa representam anomalias térmicas identificadas por sensoriamento
                    orbital nas últimas 24 horas no território de Goiás.
                </p>
            </div>
        </section>
    );
}
