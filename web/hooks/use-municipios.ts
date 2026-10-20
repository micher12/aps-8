'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMunicipios } from '@/lib/municipios-api';
import { queryKeys } from '@/lib/queryKeys';

/** Hook client compartilhado dos municípios de Goiás (stale 24h). */
export function useMunicipios() {
    return useQuery({
        queryKey: queryKeys.municipios,
        queryFn: fetchMunicipios,
        staleTime: 86_400_000,
    });
}
