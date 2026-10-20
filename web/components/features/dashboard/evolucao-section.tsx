'use client';

import dynamic from 'next/dynamic';
import { AlertasTempoReal } from '@/components/features/dashboard/AlertasTempoReal';
import type { DashboardResumo } from '@/lib/types';

const GraficoEvolucao = dynamic(() => import('@/components/features/dashboard/GraficoEvolucao'), {
    ssr: false,
});

export function EvolucaoSection({
    historico,
    organizacaoId,
}: {
    historico: DashboardResumo['historicoMensal'];
    organizacaoId?: number;
}) {
    return (
        <>
            <AlertasTempoReal organizacaoId={organizacaoId} />
            <section aria-label="Evolução histórica" className="border-t border-border/70 pt-4">
                <div className="flex items-baseline justify-between gap-4">
                    <div>
                        <p className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            Série mensal
                        </p>
                        <h2 className="mt-1 text-lg font-bold tracking-[-0.02em] text-foreground">
                            Água, energia e CO₂ mês a mês
                        </h2>
                    </div>
                    <p className="tabular hidden shrink-0 font-mono text-[11px] text-muted-foreground sm:block">
                        Fonte: lançamentos validados
                    </p>
                </div>
                <div className="mt-3">
                    <GraficoEvolucao historico={historico} />
                </div>
            </section>
        </>
    );
}
