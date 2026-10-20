import { NextResponse } from 'next/server';
import { deveUsarCookieSeguro, salvarSessao } from '@/lib/server-session';

/** POST /api/auth/login — proxy server-side; salva cookie httpOnly (token nunca vai ao JS). */
export async function POST(req: Request) {
    const body = await req.json();

    const res = await fetch(
        `${process.env.SGAI_API ?? 'http://localhost:8080/api/v1'}/auth/login`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        },
    );

    const json = await res.json();

    if (!res.ok || !json?.sucesso || !json?.token) {
        // repassa o status real do backend (401 credenciais, 429 rate-limit, 5xx)
        return NextResponse.json(json, { status: res.status });
    }

    await salvarSessao(json.token, json.usuario, deveUsarCookieSeguro(req.headers.get('host')));
    // devolve ao cliente apenas os dados de apresentação; o token fica só no cookie httpOnly
    return NextResponse.json({ sucesso: true, usuario: json.usuario });
}
