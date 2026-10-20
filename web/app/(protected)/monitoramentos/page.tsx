import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { getMonitoramentosServer } from '@/lib/monitoramentos-server';
import { getOrganizacoesServer } from '@/lib/organizacoes-server';
import { queryKeys } from '@/lib/queryKeys';
import { MonitoramentosView } from '@/components/features/monitoramentos/monitoramentos-view';
import { MonitoramentosSkeleton } from '@/components/features/monitoramentos/monitoramentos-skeleton';

export const metadata: Metadata = {
    title: 'Monitoramento Ambiental | SGAI-Go',
    description:
        'Lançamento e acompanhamento de indicadores contínuos de sustentabilidade (ISO 14001).',
};

async function MonitoramentosPrefetch() {
    // Dinâmico por request: ver IntegracoesPrefetch.
    await connection();
    const queryClient = getQueryClient();

    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: queryKeys.monitoramentos(undefined),
            queryFn: () => getMonitoramentosServer(),
            staleTime: 30_000,
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.organizacoes,
            queryFn: getOrganizacoesServer,
            staleTime: 30_000,
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MonitoramentosView />
        </HydrationBoundary>
    );
}

/** Shell server (estático) — só composição + streaming. Zero JSX de conteúdo aqui. */
export default function MonitoramentosPage() {
    return (
        <Suspense fallback={<MonitoramentosSkeleton />}>
            <MonitoramentosPrefetch />
        </Suspense>
    );
}
