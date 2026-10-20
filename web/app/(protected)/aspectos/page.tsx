import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { getAspectosServer } from '@/lib/aspectos-server';
import { getOrganizacoesServer } from '@/lib/organizacoes-server';
import { queryKeys } from '@/lib/queryKeys';
import { AspectosView } from '@/components/features/aspectos/aspectos-view';
import { AspectosSkeleton } from '@/components/features/aspectos/aspectos-skeleton';

export const metadata: Metadata = {
    title: 'Aspectos e Impactos Ambientais | SGAI-Go',
    description:
        'Matriz de avaliação de significância conforme metodologia ISO 14001 (Frequência × Gravidade × Probabilidade).',
};

async function AspectosPrefetch() {
    // Dinâmico por request: ver IntegracoesPrefetch.
    await connection();
    const queryClient = getQueryClient();

    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: queryKeys.aspectos,
            queryFn: getAspectosServer,
            staleTime: 60_000,
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.organizacoes,
            queryFn: getOrganizacoesServer,
            staleTime: 60_000,
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AspectosView />
        </HydrationBoundary>
    );
}

/** Shell server (estático) — só composição + streaming. Zero JSX de conteúdo aqui. */
export default function AspectosPage() {
    return (
        <Suspense fallback={<AspectosSkeleton />}>
            <AspectosPrefetch />
        </Suspense>
    );
}
