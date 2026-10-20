import { QueryClient } from '@tanstack/react-query';

/** Factory per-request p/ Server Components (padrão TanStack + Next App Router). */
export function getQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30_000,
                retry: (failureCount, error) => {
                    const status = (error as { status?: number })?.status;
                    // 4xx não melhora com retry (ex.: 403/404 do prefetch) — só rede/5xx
                    if (status && status < 500) return false;
                    return failureCount < 2;
                },
                refetchOnWindowFocus: false,
            },
        },
    });
}
