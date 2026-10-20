'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchLicencas } from '@/lib/licencas-api';
import { queryKeys } from '@/lib/queryKeys';

export function useLicencas(apenasVencendo: boolean, dias: number) {
    return useQuery({
        queryKey: queryKeys.licencasLista(apenasVencendo, dias),
        queryFn: () => fetchLicencas(apenasVencendo, dias),
    });
}
