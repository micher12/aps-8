import { api } from '@/lib/api';
import type { Residuo } from '@/lib/types';

export function fetchResiduos(orgId?: number): Promise<Residuo[]> {
    return api
        .get<Residuo[]>(orgId ? `/residuos?organizacaoId=${orgId}` : '/residuos')
        .then((r) => r.dados);
}
