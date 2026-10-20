'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAspectos } from '@/lib/aspectos-api';
import { queryKeys } from '@/lib/queryKeys';

export function useAspectos() {
    return useQuery({
        queryKey: queryKeys.aspectos,
        queryFn: fetchAspectos,
    });
}
