'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchResiduos } from '@/lib/residuos-api';
import { queryKeys } from '@/lib/queryKeys';

export function useResiduos(orgId?: number) {
    return useQuery({
        queryKey: queryKeys.residuos(orgId),
        queryFn: () => fetchResiduos(orgId),
    });
}
