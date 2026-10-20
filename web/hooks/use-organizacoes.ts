'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchOrganizacoes } from '@/lib/organizacoes-api';
import { queryKeys } from '@/lib/queryKeys';

/** Hook client compartilhado da lista de organizações. */
export function useOrganizacoes(enabled = true) {
    return useQuery({
        queryKey: queryKeys.organizacoes,
        queryFn: fetchOrganizacoes,
        enabled,
    });
}
