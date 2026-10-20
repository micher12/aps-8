import { api } from '@/lib/api';
import type { Licenca } from '@/lib/types';

export function fetchLicencas(apenasVencendo: boolean, dias: number): Promise<Licenca[]> {
    return api
        .get<Licenca[]>(apenasVencendo ? `/licencas/vencendo?dias=${dias}` : '/licencas')
        .then((r) => r.dados);
}
