'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchQueimadas } from '@/lib/integracoes-api';
import { queryKeys } from '@/lib/queryKeys';

export function useQueimadas() {
    return useQuery({
        queryKey: queryKeys.queimadas,
        queryFn: fetchQueimadas,
        staleTime: 1_800_000,
        refetchInterval: 900_000,
    });
}
