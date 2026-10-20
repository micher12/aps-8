'use client';

import Link from 'next/link';
import { useLicencasVencendo } from './hooks/use-dashboard';

export function AlertaLicencas() {
    const { data: licencas } = useLicencasVencendo();

    if (!licencas || licencas.length === 0) return null;

    return (
        <section
            aria-label="Licenças em risco de embargo"
            className="border-y-2 border-double border-amber-700/40 py-3 dark:border-amber-400/30"
        >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="text-sm text-foreground">
                    <span className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">
                        Prazo · Licença —{' '}
                    </span>
                    <strong className="tabular font-mono">{licencas.length} licença(s)</strong>{' '}
                    vencida(s) ou a 30 dias. Risco de embargo e autuação.
                </p>
                <Link
                    href="/licencas"
                    className="pressable shrink-0 text-xs font-semibold text-amber-700 underline underline-offset-4 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
                >
                    Auditar licenças →
                </Link>
            </div>
        </section>
    );
}
