import { serverFetch } from './server-fetch';
import type { Residuo } from './types';

export function getResiduosServer(orgId?: number): Promise<Residuo[]> {
    return serverFetch<Residuo[]>(orgId ? `/residuos?organizacaoId=${orgId}` : '/residuos', 60);
}
