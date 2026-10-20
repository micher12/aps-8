'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMonitoramentos } from '@/lib/monitoramentos-api';
import { queryKeys } from '@/lib/queryKeys';

export function useMonitoramentos(orgId?: number) {
    return useQuery({
        queryKey: queryKeys.monitoramentos(orgId),
        queryFn: () => fetchMonitoramentos(orgId),
    });
}
