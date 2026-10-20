'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDashboardResumo, fetchLicencasVencendo } from '@/lib/dashboard-api';
import { queryKeys } from '@/lib/queryKeys';

export function useDashboardResumo(orgId?: number) {
    return useQuery({
        queryKey: queryKeys.dashboardResumo(orgId),
        queryFn: () => fetchDashboardResumo(orgId),
    });
}

export function useLicencasVencendo() {
    return useQuery({
        queryKey: queryKeys.licencasVencendo(30),
        queryFn: () => fetchLicencasVencendo(30),
    });
}
