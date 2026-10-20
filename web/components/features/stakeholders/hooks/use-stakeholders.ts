'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchStakeholders } from '@/lib/stakeholders-api';
import { queryKeys } from '@/lib/queryKeys';

export function useStakeholders() {
    return useQuery({
        queryKey: queryKeys.stakeholders,
        queryFn: fetchStakeholders,
    });
}
