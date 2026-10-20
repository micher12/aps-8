import { api } from '@/lib/api';
import type { Monitoramento } from '@/lib/types';

export function fetchMonitoramentos(orgId?: number): Promise<Monitoramento[]> {
    return api
        .get<Monitoramento[]>(orgId ? `/monitoramentos?organizacaoId=${orgId}` : '/monitoramentos')
        .then((r) => r.dados);
}
