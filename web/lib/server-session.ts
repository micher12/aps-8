import 'server-only';
import { cookies } from 'next/headers';

export const TOKEN_COOKIE = 'sgaigo_token';
export const USER_COOKIE = 'sgaigo_usuario';

const BACKEND = process.env.SGAI_API ?? 'http://localhost:8080/api/v1';

/** Variáveis de produção seguras — disponíveis apenas no servidor. */
export const SECURE_COOKIE = process.env.NODE_ENV === 'production';

/**
 * Decide se o cookie de sessão usa flag `Secure`.
 * Regra: `SGAI_COOKIE_SECURE` força ('true'/'false'); senão, produção usa Secure
 * EXCETO em host local (localhost/127.0.0.1), onde o navegador nunca envia
 * cookie Secure por http — sem isso, `next start` local quebra a sessão
 * (login 200, mas todas as chamadas seguintes 401).
 */
export function deveUsarCookieSeguro(host: string | null): boolean {
    if (process.env.SGAI_COOKIE_SECURE === 'true') return true;
    if (process.env.SGAI_COOKIE_SECURE === 'false') return false;
    if (process.env.NODE_ENV !== 'production') return false;
    const h = (host ?? '').split(':')[0].toLowerCase();
    return h !== '' && h !== 'localhost' && h !== '127.0.0.1' && h !== '[::1]';
}

export async function getToken(): Promise<string | null> {
    const store = await cookies();
    return store.get(TOKEN_COOKIE)?.value ?? null;
}

export async function getUsuarioCookie(): Promise<string | null> {
    const store = await cookies();
    return store.get(USER_COOKIE)?.value ?? null;
}

function flagsCookie(seguro: boolean, httpOnly: boolean) {
    return {
        httpOnly,
        secure: seguro,
        sameSite: 'lax' as const,
        path: '/',
    };
}

export async function salvarSessao(token: string, usuario: object, seguro = SECURE_COOKIE) {
    const store = await cookies();
    const maxAge = 60 * 60 * 8; // 8h (mesmo tempo da expiração do JWT)
    store.set(TOKEN_COOKIE, token, { ...flagsCookie(seguro, true), maxAge });
    // cookie de leitura pelo cliente só com dados de apresentação (não httpOnly)
    store.set(USER_COOKIE, JSON.stringify(usuario), { ...flagsCookie(seguro, false), maxAge });
}

export async function limparSessao(seguro = SECURE_COOKIE) {
    const store = await cookies();
    // remoção via maxAge 0 COM as mesmas flags da criação — browser ignora
    // Set-Cookie Secure em http, então o flag precisa espelhar o do login
    store.set(TOKEN_COOKIE, '', { ...flagsCookie(seguro, true), maxAge: 0 });
    store.set(USER_COOKIE, '', { ...flagsCookie(seguro, false), maxAge: 0 });
}

export function backendUrl(path: string, query?: URLSearchParams): string {
    const base = `${BACKEND}${path.startsWith('/') ? path : `/${path}`}`;
    return query ? `${base}?${query}` : base;
}
