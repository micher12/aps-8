import { NextRequest, NextResponse } from 'next/server';
import { deveUsarCookieSeguro, getToken, limparSessao } from '@/lib/server-session';

const BACKEND = process.env.SGAI_API ?? 'http://localhost:8080/api/v1';

/**
 * Proxy server-side: /api/sgai/<path> → http://localhost:8080/api/v1/<path>
 * O token sai do cookie httpOnly e vai no Authorization — o JavaScript do navegador nunca vê o JWT.
 */
async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/sgai/, '');
    const url = `${BACKEND}${path}${req.nextUrl.search}`;
    const token = await getToken();

    if (!token) {
        return NextResponse.json(
            { sucesso: false, erro: { codigo: 'NAO_AUTENTICADO', mensagem: 'Sessão expirada' } },
            { status: 401 },
        );
    }

    const headers = new Headers(req.headers);
    headers.delete('host');
    headers.delete('content-length');
    headers.set('Authorization', `Bearer ${token}`);

    const body =
        req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer();

    const res = await fetch(url, {
        method: req.method,
        headers,
        body,
        duplex: 'half',
    } as RequestInit & { duplex?: string });

    if (res.status === 401) {
        // Token ausente ou morto (ex.: backend reiniciado sem JWT_SECRET fixo):
        // derruba os cookies para o próximo SSR enxergar "deslogado" e cair no /login
        await limparSessao(deveUsarCookieSeguro(req.headers.get('host')));
    }

    // devolve quaisquer content-type (JSON, CSV, PDF, imagens) intactos — inclusive para downloads
    const passthrough = new Headers(res.headers);
    passthrough.delete('content-encoding');
    passthrough.delete('transfer-encoding');

    return new NextResponse(res.body, { status: res.status, headers: passthrough });
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
