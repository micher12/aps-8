'use client';

import Link from 'next/link';
import type { DashboardResumo } from '@/lib/types';

export interface Kpi {
    label: string;
    valor: string | number;
    unidade?: string;
    detalhe: string;
    icone?: React.ComponentType<{ className?: string }>;
    alerta?: boolean;
    cor?: string;
}

function Medidor({
    codigo,
    rotulo,
    valor,
    unidade,
    fonte,
}: {
    codigo: string;
    rotulo: string;
    valor: string;
    unidade: string;
    fonte: string;
}) {
    return (
        <div className="px-4 py-4 first:pl-0 last:pr-0 sm:px-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground tabular">
                {codigo}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{rotulo}</p>
            <p className="tabular mt-2 text-3xl font-semibold tracking-[-0.015em] text-foreground">
                {valor}
                <span className="ml-1 align-baseline font-sans text-xs font-normal text-muted-foreground">
                    {unidade}
                </span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">{fonte}</p>
        </div>
    );
}

function LinhaSituacao({
    codigo,
    rotulo,
    valor,
    estado,
    acao,
}: {
    codigo: string;
    rotulo: string;
    valor: string;
    estado: 'risco' | 'atencao' | 'ok';
    acao?: { href: string; rotulo: string };
}) {
    const valorClasse =
        estado === 'risco'
            ? 'text-destructive'
            : estado === 'atencao'
              ? 'text-amber-700 dark:text-amber-300'
              : 'text-foreground';
    return (
        <div className="flex items-baseline justify-between gap-4 border-t border-border/70 py-3 first:border-t-0 first:pt-0 last:pb-0">
            <div className="flex min-w-0 items-baseline gap-3">
                <span className="tabular w-20 shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {codigo}
                </span>
                <span className="truncate text-sm text-foreground">{rotulo}</span>
            </div>
            <div className="flex shrink-0 items-baseline gap-3">
                <span className={`tabular font-mono text-lg font-bold ${valorClasse}`}>{valor}</span>
                {acao && (
                    <Link
                        href={acao.href}
                        className="pressable text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                        {acao.rotulo}
                    </Link>
                )}
            </div>
        </div>
    );
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
    return (
        <div className="border-t border-border/70 py-3 first:border-t-0 first:pt-0 last:pb-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground tabular">
                {kpi.label}
            </p>
            <p className="tabular mt-1 text-2xl font-semibold text-foreground">
                {kpi.valor}
                {kpi.unidade && (
                    <span className="ml-1 font-sans text-xs font-normal text-muted-foreground">
                        {kpi.unidade}
                    </span>
                )}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{kpi.detalhe}</p>
        </div>
    );
}

export function KpiGrid({ resumo }: { resumo: DashboardResumo }) {
    const licencas = resumo.licencasVencendo;
    const ncs = resumo.ncsAbertas;

    return (
        <section aria-label="Leitura operacional" className="space-y-6">
            <div className="grid grid-cols-1 divide-y divide-border/70 border-y border-border/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <Medidor
                    codigo="Água · m³/mês"
                    rotulo="Consumo consolidado"
                    valor={resumo.consumoAguaMes.toFixed(1)}
                    unidade="m³"
                    fonte="Apuração mensal · rede + poço"
                />
                <Medidor
                    codigo="Energia · kWh/mês"
                    rotulo="Consumo apurado"
                    valor={resumo.consumoEnergiaMes.toLocaleString('pt-BR')}
                    unidade="kWh"
                    fonte="Faturas lançadas no período"
                />
                <Medidor
                    codigo="CO₂ · kg/mês"
                    rotulo="Emissões registradas"
                    valor={resumo.emissaoCo2Mes.toLocaleString('pt-BR')}
                    unidade="kg"
                    fonte="Inventário de fontes fixas"
                />
            </div>

            <div className="border-y border-border/70 py-4">
                <p className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Situação regulatória
                </p>
                <div className="mt-3">
                    <LinhaSituacao
                        codigo="Cadastro"
                        rotulo="Organizações acompanhadas em Goiás"
                        valor={String(resumo.totalOrganizacoes)}
                        estado="ok"
                    />
                    <LinhaSituacao
                        codigo="Prazo"
                        rotulo="Licenças vencidas ou a 30 dias"
                        valor={String(licencas)}
                        estado={licencas > 0 ? 'atencao' : 'ok'}
                        acao={licencas > 0 ? { href: '/licencas', rotulo: 'Auditar' } : undefined}
                    />
                    <LinhaSituacao
                        codigo="Corretiva"
                        rotulo="Não conformidades em aberto"
                        valor={String(ncs)}
                        estado={ncs > 0 ? 'risco' : 'ok'}
                        acao={
                            ncs > 0
                                ? { href: '/nao-conformidades', rotulo: 'Tratar' }
                                : undefined
                        }
                    />
                </div>
            </div>
        </section>
    );
}
