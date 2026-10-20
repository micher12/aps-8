interface FonteCardProps {
    codigo: string;
    titulo: string;
    descricao: string;
}

/** Linha ledger — sem Card, sem ícone-caixa, sem cor decorativa. */
export function FonteCard({ codigo, titulo, descricao }: FonteCardProps) {
    return (
        <div className="border-t border-border/70 py-3 first:border-t-0 first:pt-0 last:pb-0">
            <p className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {codigo}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{titulo}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{descricao}</p>
        </div>
    );
}
