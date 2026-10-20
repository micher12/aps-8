import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { getOrganizacoesServer } from '@/lib/organizacoes-server';
import { queryKeys } from '@/lib/queryKeys';
import { RelatoriosSkeleton } from '@/components/features/relatorios/relatorios-skeleton';
import { RelatoriosView } from '@/components/features/relatorios/relatorios-view';

export const metadata: Metadata = {
    title: 'Relatórios Gerenciais | SGAI-Go',
    description:
        'Emissão de documentos oficiais e planilhas técnicas para auditoria e prestação de contas (ISO 14001).',
};

async function RelatoriosPrefetch() {
    // Dinâmico por request: ver IntegracoesPrefetch.
    await connection();
    const queryClient = getQueryClient();

    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: queryKeys.organizacoes,
            queryFn: getOrganizacoesServer,
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <RelatoriosView />
        </HydrationBoundary>
    );
}

/** Shell server (estático) — só composição + streaming. Zero JSX de conteúdo aqui. */
export default function RelatoriosPage() {
    return (
        <Suspense fallback={<RelatoriosSkeleton />}>
            <RelatoriosPrefetch />
        </Suspense>
    );
}
