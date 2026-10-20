import { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { getUsuariosServer } from '@/lib/usuarios-server';
import { queryKeys } from '@/lib/queryKeys';
import { UsuariosView } from '@/components/features/usuarios/usuarios-view';
import { UsuariosSkeleton } from '@/components/features/usuarios/usuarios-skeleton';

export const metadata: Metadata = {
    title: 'Gestão de Usuários | SGAI-Go',
    description:
        'Controle de contas institucionais, papéis operacionais e permissões de acesso.',
};

async function UsuariosPrefetch() {
    // Dinâmico por request: ver IntegracoesPrefetch.
    await connection();
    const queryClient = getQueryClient();

    // Tolera 403 de não-ADMIN: o client exibe Acesso Restrito via isError.
    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: queryKeys.usuarios,
            queryFn: getUsuariosServer,
            staleTime: 30_000,
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <UsuariosView />
        </HydrationBoundary>
    );
}

/** Shell server (estático) — só composição + streaming. Zero JSX de conteúdo aqui. */
export default function UsuariosPage() {
    return (
        <Suspense fallback={<UsuariosSkeleton />}>
            <UsuariosPrefetch />
        </Suspense>
    );
}
