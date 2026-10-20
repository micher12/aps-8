import { NextRequest, NextResponse } from 'next/server';
import { backendUrl, deveUsarCookieSeguro, getToken, limparSessao } from '@/lib/server-session';

/** POST /api/auth/logout — revoga o token no back e limpa os cookies da sessão. */
export async function POST(req: NextRequest) {
    const token = await getToken();
    if (token) {
        try {
            await fetch(backendUrl('/auth/logout'), {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch {
            // backend indisponível — a sessão local é encerrada de qualquer forma
        }
    }
    await limparSessao(deveUsarCookieSeguro(req.headers.get('host')));
    return NextResponse.json({ sucesso: true });
}
