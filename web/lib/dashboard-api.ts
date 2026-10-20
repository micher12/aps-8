import { api } from '@/lib/api';
import type { DashboardResumo, Licenca } from '@/lib/types';

export function fetchDashboardResumo(orgId?: number): Promise<DashboardResumo> {
    const url = orgId ? `/dashboard/resumo?organizacaoId=${orgId}` : '/dashboard/resumo';
    return api.get<DashboardResumo>(url).then((r) => r.dados);
}

export function fetchLicencasVencendo(dias = 30): Promise<Licenca[]> {
    return api.get<Licenca[]>(`/licencas/vencendo?dias=${dias}`).then((r) => r.dados);
}
