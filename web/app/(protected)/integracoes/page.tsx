import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary, noop } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import {
    getMunicipiosServer,
    getQualidadeArServer,
    getQueimadasServer,
} from '@/lib/integracoes-server';
import { queryKeys } from '@/lib/queryKeys';
import { IntegracoesView } from '@/components/features/integracoes/integracoes-view';
import { IntegracoesSkeleton } from '@/components/features/integracoes/integracoes-skeleton';

export const metadata: Metadata = {
    title: 'Integrações Externas & Sensoriamento | SGAI-Go',
    description:
        'Qualidade do ar (Open-Meteo) e focos de queimadas (NASA FIRMS) no estado de Goiás.',
};

const MUNICIPIO_PADRAO = '5208707'; // Goiânia

async function IntegracoesPrefetch({ municipio }: { municipio: string }) {
    // Dinâmico por request: dado é por-token (nunca cache estático) e o dehydrate
    // carimba Date.now(), que o prerender proíbe.
    await connection();
    const queryClient = getQueryClient();

    await Promise.allSettled([
        queryClient.query({
            queryKey: queryKeys.municipios,
            queryFn: getMunicipiosServer,
            staleTime: 86_400_000,
        }).catch(noop),
        queryClient.query({
            queryKey: queryKeys.qualidadeAr(municipio),
            queryFn: () => getQualidadeArServer(municipio),
            staleTime: 3_600_000,
        }).catch(noop),
        queryClient.query({
            queryKey: queryKeys.queimadas,
            queryFn: getQueimadasServer,
            staleTime: 1_800_000,
        }).catch(noop),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <IntegracoesView municipioInicial={municipio} />
        </HydrationBoundary>
    );
}

export default function IntegracoesPage() {
    return (
        <Suspense fallback={<IntegracoesSkeleton />}>
            <IntegracoesPrefetch municipio={MUNICIPIO_PADRAO} />
        </Suspense>
    );
}
