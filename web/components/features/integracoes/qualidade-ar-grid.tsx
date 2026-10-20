import { Skeleton } from '@/components/ui/skeleton';
import type { QualidadeAr } from '@/lib/types';
import { QualidadeArMetrica } from './qualidade-ar-metrica';

interface QualidadeArGridProps {
    ar?: QualidadeAr;
    cidadeSelecionada: string;
}

function indiceClasse(classificacao: string): string {
    if (classificacao === 'MUITO_RUIM') return 'text-destructive';
    if (classificacao === 'RUIM') return 'text-orange-700 dark:text-orange-300';
    if (classificacao === 'MODERADA') return 'text-amber-700 dark:text-amber-300';
    return 'text-foreground';
}

const INDICE_ROTULO: Record<string, string> = {
    BOA: 'Boa',
    MODERADA: 'Moderada',
    RUIM: 'Ruim',
    MUITO_RUIM: 'Muito ruim',
    INDISPONIVEL: 'Indisponível',
};

export function QualidadeArGrid({ ar, cidadeSelecionada }: QualidadeArGridProps) {
    if (!ar || ar.dadosIndisponiveis) {
        return (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Carregando qualidade do ar">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 divide-y divide-border/70 border-y border-border/70 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            <QualidadeArMetrica
                rotulo="PM2.5 · Particulado"
                valor={ar.pm25?.toFixed(1) ?? '—'}
                unidade="μg/m³"
            />
            <QualidadeArMetrica
                rotulo="PM10 · Particulado"
                valor={ar.pm10?.toFixed(1) ?? '—'}
                unidade="μg/m³"
            />
            <QualidadeArMetrica
                rotulo="CO · Monóxido"
                valor={ar.co?.toFixed(0) ?? '—'}
                unidade="μg/m³"
            />
            <div className="px-4 py-4 first:pl-0 last:pr-0 sm:px-5">
                <p className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Índice · {cidadeSelecionada}
                </p>
                <p
                    className={`tabular mt-2 font-mono text-2xl font-bold tracking-tight ${indiceClasse(ar.classificacao)}`}
                >
                    {INDICE_ROTULO[ar.classificacao] ?? ar.classificacao}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Classificação Open-Meteo</p>
            </div>
        </div>
    );
}
