import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { getDashboardResumoServer, getLicencasVencendoServer } from '@/lib/dashboard-server';
import { queryKeys } from '@/lib/queryKeys';
import { DashboardSkeleton } from '@/components/features/dashboard/dashboard-skeleton';
import { DashboardView } from '@/components/features/dashboard/dashboard-view';

export const metadata: Metadata = {
    title: 'Painel Geral de Governança Ambiental | SGAI-Go',
    description:
        'Visão consolidada das organizações do estado de Goiás conforme requisitos ISO 14001.',
};

async function DashboardPrefetch() {
    // Dinâmico por request: ver IntegracoesPrefetch.
    await connection();
    const queryClient = getQueryClient();

    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: queryKeys.dashboardResumo(),
            queryFn: getDashboardResumoServer,
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.licencasVencendo(30),
            queryFn: () => getLicencasVencendoServer(30),
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DashboardView />
        </HydrationBoundary>
    );
}

/** Shell server (estático) — só composição + streaming. Zero JSX de conteúdo aqui. */
export default function DashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardPrefetch />
        </Suspense>
    );
}
