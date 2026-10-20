import { serverFetch } from './server-fetch';
import type { NaoConformidade } from './types';

export function getNaoConformidadesServer(orgId?: number): Promise<NaoConformidade[]> {
    return serverFetch<NaoConformidade[]>(
        orgId ? `/nao-conformidades?organizacaoId=${orgId}` : '/nao-conformidades',
        60,
    );
}
