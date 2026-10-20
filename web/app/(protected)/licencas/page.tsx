import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { getLicencasServer } from '@/lib/licencas-server';
import { getOrganizacoesServer } from '@/lib/organizacoes-server';
import { queryKeys } from '@/lib/queryKeys';
import { LicencasView } from '@/components/features/licencas/licencas-view';
import { LicencasSkeleton } from '@/components/features/licencas/licencas-skeleton';

export const metadata: Metadata = {
    title: 'Licenças Ambientais | SGAI-Go',
    description:
        'Controle de prazos e conformidade regulatória junto aos órgãos ambientais (SEMAD / IBAMA).',
};

async function LicencasPrefetch() {
    // Dinâmico por request: ver IntegracoesPrefetch.
    await connection();
    const queryClient = getQueryClient();

    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: queryKeys.licencasLista(false, 30),
            queryFn: () => getLicencasServer(),
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.organizacoes,
            queryFn: getOrganizacoesServer,
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <LicencasView />
        </HydrationBoundary>
    );
}


export default function LicencasPage() {
    return (
        <Suspense fallback={<LicencasSkeleton />}>
            <LicencasPrefetch />
        </Suspense>
    );
}
