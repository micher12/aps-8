import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { getResiduosServer } from '@/lib/residuos-server';
import { getOrganizacoesServer } from '@/lib/organizacoes-server';
import { queryKeys } from '@/lib/queryKeys';
import { ResiduosView } from '@/components/features/residuos/residuos-view';
import { ResiduosSkeleton } from '@/components/features/residuos/residuos-skeleton';

export const metadata: Metadata = {
    title: 'Inventário de Resíduos | SGAI-Go',
    description:
        'Rastreabilidade, classificação normativa ABNT e destinação ambiental final.',
};

async function ResiduosPrefetch() {
    // Dinâmico por request: ver IntegracoesPrefetch.
    await connection();
    const queryClient = getQueryClient();

    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: queryKeys.residuos(undefined),
            queryFn: () => getResiduosServer(),
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.organizacoes,
            queryFn: getOrganizacoesServer,
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ResiduosView />
        </HydrationBoundary>
    );
}

/** Shell server (estático) — só composição + streaming. Zero JSX de conteúdo aqui. */
export default function ResiduosPage() {
    return (
        <Suspense fallback={<ResiduosSkeleton />}>
            <ResiduosPrefetch />
        </Suspense>
    );
}
