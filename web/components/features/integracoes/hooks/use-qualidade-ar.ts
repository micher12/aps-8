'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchQualidadeAr } from '@/lib/integracoes-api';
import { queryKeys } from '@/lib/queryKeys';

export function useQualidadeAr(municipio: string) {
    return useQuery({
        queryKey: queryKeys.qualidadeAr(municipio),
        queryFn: () => fetchQualidadeAr(municipio),
        staleTime: 3_600_000,
    });
}
