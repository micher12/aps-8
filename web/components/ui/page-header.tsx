import type { ReactNode } from 'react';

export function PageHeader({
    protocolo,
    titulo,
    descricao,
    acao,
}: {
    protocolo: string;
    titulo: string;
    descricao: string;
    acao?: ReactNode;
}) {
    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="tabular text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                        {protocolo}
                    </p>
                    <h1 className="mt-1 max-w-[24ch] text-balance text-2xl font-semibold tracking-[-0.015em] text-foreground">
                        {titulo}
                    </h1>
                    <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">{descricao}</p>
                </div>
                {acao && <div className="shrink-0">{acao}</div>}
            </div>
        </div>
    );
}
