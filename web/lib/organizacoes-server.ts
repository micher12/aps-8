import { serverFetch } from './server-fetch';
import type { Organizacao } from './types';

export function getOrganizacoesServer(): Promise<Organizacao[]> {
    return serverFetch<Organizacao[]>('/organizacoes', 60);
}
