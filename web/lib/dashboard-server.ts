import { serverFetch } from './server-fetch';
import type { DashboardResumo, Licenca } from './types';

export function getDashboardResumoServer(): Promise<DashboardResumo> {
    return serverFetch<DashboardResumo>('/dashboard/resumo', 60);
}

export function getLicencasVencendoServer(dias = 30): Promise<Licenca[]> {
    return serverFetch<Licenca[]>(`/licencas/vencendo?dias=${dias}`, 60);
}
