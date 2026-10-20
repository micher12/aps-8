import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { getStakeholdersServer } from '@/lib/stakeholders-server';
import { getOrganizacoesServer } from '@/lib/organizacoes-server';
import { queryKeys } from '@/lib/queryKeys';
import { StakeholdersView } from '@/components/features/stakeholders/stakeholders-view';
import { StakeholdersSkeleton } from '@/components/features/stakeholders/stakeholders-skeleton';

export const metadata: Metadata = {
    title: 'Partes Interessadas (Stakeholders) | SGAI-Go',
    description:
        'Mapeamento, canais de comunicação e governança com a sociedade, órgãos reguladores e cadeia de suprimentos.',
};

async function StakeholdersPrefetch() {
    // Dinâmico por request: ver IntegracoesPrefetch.
    await connection();
    const queryClient = getQueryClient();

    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: queryKeys.stakeholders,
            queryFn: getStakeholdersServer,
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
            <StakeholdersView />
        </HydrationBoundary>
    );
}

/** Shell server (estático) — só composição + streaming. Zero JSX de conteúdo aqui. */
export default function StakeholdersPage() {
    return (
        <Suspense fallback={<StakeholdersSkeleton />}>
            <StakeholdersPrefetch />
        </Suspense>
    );
}
