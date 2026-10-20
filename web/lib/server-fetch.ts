import 'server-only';

import { backendUrl, getToken } from './server-session';

interface BackendEnvelope<T> {
    sucesso: boolean;
    dados: T;
}

/** Carrega o status HTTP para que as políticas de retry (React Query) saibam o que fazer. */
export class ServerFetchError extends Error {
    readonly status: number;

    constructor(status: number) {
        super(`ERRO_HTTP_${status}`);
        this.name = 'ServerFetchError';
        this.status = status;
    }
}

/**
 * Fetch server-side autenticado p/ pre-fetch (DIP: `*-server.ts` dependem daqui,
 * nunca de `fetch` cru nem de `lib/api.ts` — que usa `document.cookie` e quebra no server).
 * Falhas devem ser toleradas pela page via `Promise.allSettled`.
 */
export async function serverFetch<T>(path: string, revalidate = 60): Promise<T> {
    const token = await getToken();
    if (!token) throw new Error('NAO_AUTENTICADO');

    const res = await fetch(backendUrl(path), {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate },
    });

    if (!res.ok) throw new ServerFetchError(res.status);
    const body = (await res.json()) as BackendEnvelope<T>;
    return body.dados;
}
