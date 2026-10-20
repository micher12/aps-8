import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout'];

/**
 * Guarda de rota: sem o cookie httpOnly do token → redireciona para /login.
 * Roda no edge antes de qualquer página renderizar.
 */
export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isPublic =
        PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
        pathname.startsWith('/_next') ||
        pathname === '/favicon.ico';

    const token = req.cookies.get('sgaigo_token')?.value;
    // Sessão inexistente OU com exp já passado (decodificado sem validar assinatura —
    // a assinatura quem valida é o backend; aqui só antecipamos o redirect do caso óbvio)
    const semSessao = !token || tokenExpirado(token);

    if (!isPublic && semSessao) {
        // Rotas de API (/api/sgai/…): devolve 401 JSON em vez de redirect — o front trata e manda ao login
        if (pathname.startsWith('/api/sgai')) {
            const res = NextResponse.json(
                {
                    sucesso: false,
                    erro: { codigo: 'NAO_AUTENTICADO', mensagem: 'Sessão expirada' },
                },
                { status: 401 },
            );
            limparCookiesSessao(res);
            return res;
        }
        const login = new URL('/login', req.url);
        login.searchParams.set('next', pathname);
        if (token) login.searchParams.set('expired', '1');
        const res = NextResponse.redirect(login);
        limparCookiesSessao(res);
        return res;
    }
    if (pathname === '/login' && token && !tokenExpirado(token)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

/** true se o JWT já passou do `exp` (só leitura do payload, sem validar assinatura). */
function tokenExpirado(token: string): boolean {
    try {
        const b64 = token.split('.')[1];
        if (!b64) return true;
        const bin = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
        const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
        const payload = JSON.parse(new TextDecoder().decode(bytes)) as { exp?: unknown };
        return typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now();
    } catch {
        return false; // ilegível aqui → deixa o backend decidir
    }
}

function limparCookiesSessao(res: NextResponse) {
    res.cookies.delete('sgaigo_token');
    res.cookies.delete('sgaigo_usuario');
}
