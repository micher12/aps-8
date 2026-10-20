import { api } from '@/lib/api';
import type { Organizacao } from '@/lib/types';

export interface CnpjBrasilApi {
    razao_social: string;
    municipio: string;
    codigo_municipio_ibge: number;
    logradouro: string;
    cep: string;
}

/** Fetchers client de organizações (compartilhados entre features). */
export function fetchOrganizacoes(): Promise<Organizacao[]> {
    return api.get<Organizacao[]>('/organizacoes').then((r) => r.dados);
}

export function fetchCnpjBrasilApi(cnpjLimpo: string): Promise<CnpjBrasilApi> {
    return api.get<CnpjBrasilApi>(`/integracoes/cnpj/${cnpjLimpo}`).then((r) => r.dados);
}
