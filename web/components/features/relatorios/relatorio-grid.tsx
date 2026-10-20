'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RELATORIOS } from './relatorios-dados';

export function RelatorioGrid({ orgId }: { orgId: string }) {
    const [relatorioAtivo, setRelatorioAtivo] = useState<string | null>(null);

    const gerar = useMutation({
        mutationFn: async (relatorioId: string) => {
            setRelatorioAtivo(relatorioId);
            const url = `/api/sgai/relatorios/${relatorioId}${orgId ? `?organizacaoId=${orgId}` : ''}`;
            const res = await fetch(url, { method: 'POST', credentials: 'same-origin' });
            if (res.status === 401) {
                document.cookie = 'sgaigo_usuario=; Max-Age=0; path=/';
                window.location.replace('/login');
                throw new Error('Sessão expirada. Entre novamente.');
            }
            if (!res.ok) throw new Error(`Falha no servidor (${res.status}) ao processar relatório`);
            const blob = await res.blob();
            const ext = relatorioId === 'residuos' || relatorioId === 'indicadores' ? 'csv' : 'pdf';
            const a = document.createElement('a');
            const href = URL.createObjectURL(blob);
            a.href = href;
            a.download = `sgaigo_${relatorioId}_${new Date().toISOString().split('T')[0]}.${ext}`;
            a.click();
            // revogar depois: alguns navegadores cancelam o download se a URL morre de imediato
            setTimeout(() => URL.revokeObjectURL(href), 10_000);
        },
        onSuccess: () => {
            toast.success('Relatório gerado e download iniciado');
            setRelatorioAtivo(null);
        },
        onError: (e: Error) => {
            toast.error(e.message);
            setRelatorioAtivo(null);
        },
    });

    return (
        <section
            aria-label="Relatórios disponíveis"
            className="divide-y divide-border/70 border-y border-border/70"
        >
            {RELATORIOS.map((r) => {
                const baixando = gerar.isPending && relatorioAtivo === r.id;

                return (
                    <div
                        key={r.id}
                        className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="min-w-0">
                            <p className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                                {r.formato} · {r.id}
                            </p>
                            <h2 className="mt-1 text-base font-bold tracking-[-0.02em] text-foreground">
                                {r.nome}
                            </h2>
                            <p className="mt-0.5 max-w-[70ch] text-xs leading-relaxed text-muted-foreground">
                                {r.descricao}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => gerar.mutate(r.id)}
                            disabled={gerar.isPending}
                            className="pressable shrink-0 gap-2 sm:w-auto"
                        >
                            {baixando ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Gerando documento…
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4" />
                                    Exportar {r.formato.toUpperCase()}
                                </>
                            )}
                        </Button>
                    </div>
                );
            })}
        </section>
    );
}
