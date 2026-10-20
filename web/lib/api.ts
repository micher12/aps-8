import { toast } from 'sonner';
import { ApiErrorBody } from './types';

const BASE = '/api/sgai';

/** Evita que N queries paralelas disparem N toasts/redirects no mesmo 401. */
let redirecionando = false;

export class ApiError extends Error {
    codigo: string;
    detalhes?: Record<string, string>;
    status: number;

    constructor(status: number, body: ApiErrorBody) {
        super(body.erro.mensagem);
        this.status = status;
        this.codigo = body.erro.codigo;
        this.detalhes = body.erro.detalhes;
    }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    // Cookie httpOnly é enviado automaticamente (mesma origem); o proxy adiciona o Bearer no servidor
    const res = await fetch(`${BASE}${path}`, {
        ...init,
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers ?? {}),
        },
    });

    if (res.ok) {
        return res.json() as Promise<T>;
    }

    const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
    const err = new ApiError(
        res.status,
        body ?? {
            sucesso: false,
            erro: { codigo: 'ERRO_HTTP', mensagem: `Erro ${res.status}` },
        },
    );

    if (typeof window !== 'undefined') {
        if (res.status === 401) {
            // Sessão expirada: um único toast + um único redirect, mesmo com várias queries
            document.cookie = 'sgaigo_usuario=; Max-Age=0; path=/'; // limpa o cookie de apresentação
            if (!redirecionando && !window.location.pathname.startsWith('/login')) {
                redirecionando = true;
                toast.error('Sessão expirada. Entre novamente.');
                window.location.replace('/login?expired=1');
            }
        } else {
            const detalhes = err.detalhes ? Object.values(err.detalhes).join(' · ') : '';
            toast.error(detalhes ? `${err.message}: ${detalhes}` : err.message);
        }
    }

    throw err;
}

export const api = {
    get: <T>(path: string) => request<{ sucesso: true; dados: T }>(path),
    post: <T>(path: string, body: unknown) =>
        request<{ sucesso: true; dados: T }>(path, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(path: string, body: unknown) =>
        request<{ sucesso: true; dados: T }>(path, { method: 'PUT', body: JSON.stringify(body) }),
    patch: <T>(path: string, body: unknown) =>
        request<{ sucesso: true; dados: T }>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (path: string) => request<{ sucesso: true; dados: null }>(path, { method: 'DELETE' }),
};
