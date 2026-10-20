interface QualidadeArMetricaProps {
    rotulo: string;
    valor: string;
    unidade: string;
}

/** Célula ledger — sem caixa, sem borda interna, sem cor decorativa. */
export function QualidadeArMetrica({ rotulo, valor, unidade }: QualidadeArMetricaProps) {
    return (
        <div className="px-4 py-4 first:pl-0 last:pr-0 sm:px-5">
            <p className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {rotulo}
            </p>
            <p className="tabular mt-2 font-mono text-2xl font-bold tracking-tight text-foreground">
                {valor}
                <span className="ml-1 font-sans text-xs font-normal text-muted-foreground">
                    {unidade}
                </span>
            </p>
        </div>
    );
}
