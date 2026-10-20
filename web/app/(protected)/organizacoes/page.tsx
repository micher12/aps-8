import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { getMunicipiosServer } from '@/lib/municipios-server';
import { getOrganizacoesServer } from '@/lib/organizacoes-server';
import { queryKeys } from '@/lib/queryKeys';
import { OrganizacoesView } from '@/components/features/organizacoes/organizacoes-view';
import { OrganizacoesSkeleton } from '@/components/features/organizacoes/organizacoes-skeleton';

export const metadata: Metadata = {
    title: 'Organizações | SGAI-Go',
    description: 'Empresas e órgãos de Goiás sob governança ambiental ISO 14001.',
};

async function OrganizacoesPrefetch() {
    // Dinâmico por request: ver IntegracoesPrefetch.
    await connection();
    const queryClient = getQueryClient();

    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: queryKeys.organizacoes,
            queryFn: getOrganizacoesServer,
            staleTime: 60_000,
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.municipios,
            queryFn: getMunicipiosServer,
            staleTime: 86_400_000,
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <OrganizacoesView />
        </HydrationBoundary>
    );
}

/** Shell server (estático) — só composição + streaming. Zero JSX de conteúdo aqui. */
export default function OrganizacoesPage() {
    return (
        <Suspense fallback={<OrganizacoesSkeleton />}>
            <OrganizacoesPrefetch />
        </Suspense>
    );
}
