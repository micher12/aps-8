interface QueimadasBadgeProps {
    total: number;
    dadosIndisponiveis: boolean;
}

/** Status como texto mono tabular — sem Badge pill. Cor só se significativo. */
export function QueimadasBadge({ total, dadosIndisponiveis }: QueimadasBadgeProps) {
    if (dadosIndisponiveis) {
        return (
            <p className="tabular shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">
                Chave MAP_KEY pendente
            </p>
        );
    }
    return (
        <p
            className={`tabular shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.12em] ${
                total > 0 ? 'text-destructive' : 'text-muted-foreground'
            }`}
        >
            {total} foco(s) · 24h
        </p>
    );
}
