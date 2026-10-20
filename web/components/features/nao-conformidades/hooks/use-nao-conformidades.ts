'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAcoesCorretivas, fetchNaoConformidades } from '@/lib/nao-conformidades-api';
import { queryKeys } from '@/lib/queryKeys';

export function useNaoConformidades(orgId?: number) {
    return useQuery({
        queryKey: queryKeys.naoConformidades(orgId),
        queryFn: () => fetchNaoConformidades(orgId),
    });
}

export function useAcoesCorretivas(ncId: number | null, enabled: boolean) {
    return useQuery({
        queryKey: queryKeys.acoesCorretivas(ncId),
        queryFn: () => fetchAcoesCorretivas(ncId!),
        enabled: enabled && ncId !== null,
    });
}
