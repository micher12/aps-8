import { serverFetch } from './server-fetch';
import type { Monitoramento } from './types';

export function getMonitoramentosServer(orgId?: number): Promise<Monitoramento[]> {
    return serverFetch<Monitoramento[]>(
        orgId ? `/monitoramentos?organizacaoId=${orgId}` : '/monitoramentos',
        60,
    );
}
