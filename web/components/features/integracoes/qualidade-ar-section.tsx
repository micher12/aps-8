'use client';

import { useState } from 'react';
import { MunicipioSelect } from './municipio-select';
import { QualidadeArGrid } from './qualidade-ar-grid';
import { useMunicipios } from '@/hooks/use-municipios';
import { useQualidadeAr } from './hooks/use-qualidade-ar';

interface QualidadeArSectionProps {
    municipioInicial: string;
}

export function QualidadeArSection({ municipioInicial }: QualidadeArSectionProps) {
    const [municipio, setMunicipio] = useState(municipioInicial);
    const { data: municipios } = useMunicipios();
    const { data: ar, isFetching, isError, error } = useQualidadeAr(municipio);

    const cidadeSelecionada =
        municipios?.find((m) => String(m.codigoIbge) === municipio)?.nome ?? 'Goiânia';

    return (
        <section aria-label="Qualidade do ar" className="border-t border-border/70 pt-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Atmosfera · Open-Meteo
                    </p>
                    <h2 className="mt-1 text-lg font-bold tracking-[-0.02em] text-foreground">
                        Qualidade do ar em tempo real
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Telemetria atmosférica via API Open-Meteo Air Quality
                    </p>
                </div>
                <MunicipioSelect
                    value={municipio}
                    onChange={setMunicipio}
                    municipios={municipios}
                    isFetching={isFetching}
                />
            </div>
            {isError && (
                <p className="tabular mt-3 font-mono text-[11px] text-amber-700 dark:text-amber-300">
                    Dados externos temporariamente indisponíveis: {(error as Error).message}.
                    O sistema continua funcionando com dados locais.
                </p>
            )}
            <div className="mt-3">
                <QualidadeArGrid ar={ar} cidadeSelecionada={cidadeSelecionada} />
            </div>
        </section>
    );
}
