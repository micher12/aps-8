export type LedgerEstado = 'ok' | 'atencao' | 'risco';

export interface LedgerItem {
    codigo: string;
    rotulo: string;
    valor: string;
    fonte: string;
    estado?: LedgerEstado;
}

function valorClasse(estado: LedgerEstado): string {
    if (estado === 'risco') return 'text-destructive';
    if (estado === 'atencao') return 'text-amber-700 dark:text-amber-300';
    return 'text-foreground';
}

/** Faixa ledger — substitui grade de cards-ícone. Sem ícone-caixa, sem cor decorativa. */
export function LedgerKpis({ items, colunas = 4 }: { items: LedgerItem[]; colunas?: 3 | 4 }) {
    const grade =
        colunas === 3
            ? 'sm:grid-cols-3'
            : 'sm:grid-cols-2 lg:grid-cols-4';
    return (
        <section
            aria-label="Leitura operacional"
            className={`grid grid-cols-1 divide-y divide-border/70 border-y border-border/70 ${grade} sm:divide-x sm:divide-y-0`}
        >
            {items.map((item) => (
                <div key={item.codigo} className="px-4 py-4 first:pl-0 last:pr-0 sm:px-5">
                    <p className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        {item.codigo}
                    </p>
                    <p className="tabular mt-2 text-3xl font-semibold tracking-[-0.015em]">
                        <span className={valorClasse(item.estado ?? 'ok')}>{item.valor}</span>
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">{item.rotulo}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{item.fonte}</p>
                </div>
            ))}
        </section>
    );
}
