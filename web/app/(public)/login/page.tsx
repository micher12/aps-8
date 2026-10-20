'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, LogIn, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface LoginServiceResponse {
    sucesso: boolean;
    usuario?: { id: number; nome: string; email: string; perfil: string };
    erro?: { mensagem: string };
}

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState<string | null>(() =>
        typeof window !== 'undefined' &&
            new URLSearchParams(window.location.search).get('expired') === '1'
            ? 'Sua sessão expirou. Entre novamente.'
            : null,
    );
    const [carregando, setCarregando] = useState(false);

    async function entrar(e: React.FormEvent) {
        e.preventDefault();
        setErro(null);
        setCarregando(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
                credentials: 'same-origin',
            });
            const json = (await res.json()) as LoginServiceResponse;
            if (!res.ok || !json.sucesso) {
                setErro(json.erro?.mensagem ?? 'E-mail ou senha incorretos');
                return;
            }
            const destino = new URLSearchParams(window.location.search).get('next');
            router.push(destino && destino.startsWith('/') && !destino.startsWith('//') ? destino : '/dashboard');
        } catch {
            setErro('Falha de conexão com o servidor. Verifique se o serviço está ativo.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="relative flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
            <div className="relative z-10 w-full max-w-md">
                <p className="tabular mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                    Protocolo SGAI-Go · ISO 14001 · Goiás
                </p>
                <Card className="border-border bg-card shadow-[0_18px_50px_-24px_rgb(0_0_0_/_0.4)]">
                    <CardHeader className="space-y-3 pb-6">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fill text-primary-foreground">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-xl font-bold tracking-[-0.02em] text-foreground">
                                    SGAI<span className="text-primary">-Go</span>
                                </span>
                                <p className="text-[11px] text-muted-foreground">
                                    Gestão ambiental · Cerrado goiano
                                </p>
                            </div>
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-semibold tracking-[-0.015em] text-foreground">
                                Acesso ao sistema
                            </CardTitle>
                            <CardDescription className="mt-1 text-sm text-muted-foreground">
                                Entre com a credencial institucional para abrir a sala de controle.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <form onSubmit={entrar}>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    E-mail institucional
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="username"
                                    placeholder="nome@organizacao.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-10 bg-background/60"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="senha" className="text-sm font-medium">
                                        Senha
                                    </Label>
                                </div>
                                <Input
                                    id="senha"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder=""
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className="h-10 bg-background/60"
                                />
                            </div>

                            {erro && (
                                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                                    {erro}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={carregando}
                                className="pressable h-11 w-full rounded-full font-medium shadow-sm transition-all"
                            >
                                {carregando ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Autenticando…
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Entrar no SGAI-Go
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </main>
    );
}
