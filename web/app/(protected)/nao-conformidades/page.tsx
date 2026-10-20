import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { getNaoConformidadesServer } from '@/lib/nao-conformidades-server';
import { getOrganizacoesServer } from '@/lib/organizacoes-server';
import { queryKeys } from '@/lib/queryKeys';
import { NaoConformidadesView } from '@/components/features/nao-conformidades/nao-conformidades-view';
import { NaoConformidadesSkeleton } from '@/components/features/nao-conformidades/nao-conformidades-skeleton';

export const metadata: Metadata = {
    title: 'Não Conformidades | SGAI-Go',
    description:
        'Auditorias, controle de gravidade e fluxo de ações corretivas (ISO 14001).',
};

async function NaoConformidadesPrefetch() {
    // Dinâmico por request: ver IntegracoesPrefetch.
    await connection();
    const queryClient = getQueryClient();

    // Ações corretivas NÃO prefetcham: dependem da NC selecionada (query com `enabled`).
    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: queryKeys.naoConformidades(undefined),
            queryFn: () => getNaoConformidadesServer(),
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
            <NaoConformidadesView />
        </HydrationBoundary>
    );
}

/** Shell server (estático) — só composição + streaming. Zero JSX de conteúdo aqui. */
export default function NaoConformidadesPage() {
    return (
        <Suspense fallback={<NaoConformidadesSkeleton />}>
            <NaoConformidadesPrefetch />
        </Suspense>
    );
}
