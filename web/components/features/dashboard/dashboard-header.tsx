export function DashboardHeader() {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary tabular">
                SGAI-Go · Sala de controle · 246 municípios IBGE
            </p>
            <h1 className="mt-1 max-w-[22ch] text-balance text-2xl font-semibold tracking-[-0.015em] text-foreground sm:text-[1.75rem] sm:leading-[1.1]">
                Recursos sob controle. Prazo decide embargo.
            </h1>
            <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
                Leitura operacional conforme ISO 14001 — o que vence primeiro aparece primeiro.
            </p>
        </div>
    );
}
