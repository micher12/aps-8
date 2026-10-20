// Leitura de apresentação (dados do usuário) — o token JWT fica somente no cookie httpOnly (servidor).
import { useSyncExternalStore } from 'react';

const USER_COOKIE = 'sgaigo_usuario';

export interface UsuarioCookie {
    id: number;
    nome: string;
    email: string;
    perfil: 'ADMIN' | 'GESTOR' | 'CONSULTOR';
}

let cachedCookie = '';
let cachedUsuario: UsuarioCookie | null = null;

export function getUsuario(): UsuarioCookie | null {
    if (typeof document === 'undefined') return null;
    const currentCookie = document.cookie;
    if (currentCookie === cachedCookie) {
        return cachedUsuario;
    }
    cachedCookie = currentCookie;
    const match = currentCookie.match(new RegExp('(?:^|; )' + USER_COOKIE + '=([^;]*)'));
    if (!match) {
        cachedUsuario = null;
        return null;
    }
    try {
        cachedUsuario = JSON.parse(decodeURIComponent(match[1])) as UsuarioCookie;
        return cachedUsuario;
    } catch {
        cachedUsuario = null;
        return null;
    }
}

function subscribe(callback: () => void) {
    window.addEventListener('focus', callback);
    return () => window.removeEventListener('focus', callback);
}

export function useUsuario(): UsuarioCookie | null {
    return useSyncExternalStore(subscribe, getUsuario, () => null);
}

export function isAutenticado(): boolean {
    return getUsuario() !== null;
}

export async function sair(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    document.cookie = USER_COOKIE + '=; Max-Age=0; path=/';
    window.location.replace('/login');
}
