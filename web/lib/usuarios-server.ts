import { serverFetch } from './server-fetch';
import type { Usuario } from './types';

export function getUsuariosServer(): Promise<Usuario[]> {
    return serverFetch<Usuario[]>('/usuarios', 60);
}
