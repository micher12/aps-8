import { api } from '@/lib/api';
import type { AcaoCorretiva, NaoConformidade } from '@/lib/types';

export function fetchNaoConformidades(orgId?: number): Promise<NaoConformidade[]> {
    return api
        .get<NaoConformidade[]>(
            orgId ? `/nao-conformidades?organizacaoId=${orgId}` : '/nao-conformidades',
        )
        .then((r) => r.dados);
}

export function fetchAcoesCorretivas(ncId: number): Promise<AcaoCorretiva[]> {
    return api
        .get<AcaoCorretiva[]>(`/acoes-corretivas?naoConformidadeId=${ncId}`)
        .then((r) => r.dados);
}
