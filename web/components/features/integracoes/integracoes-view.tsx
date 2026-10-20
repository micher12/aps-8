'use client';

import { FontesIntegradasGrid } from './fontes-integradas-grid';
import { IntegracoesHeader } from './integracoes-header';
import { QualidadeArSection } from './qualidade-ar-section';
import { QueimadasSection } from './queimadas-section';

interface IntegracoesViewProps {
    municipioInicial: string;
}

/** Orquestra seções. Cada seção detém próprio estado/dados (SRP). */
export function IntegracoesView({ municipioInicial }: IntegracoesViewProps) {
    return (
        <div className="space-y-6">
            <IntegracoesHeader />
            <QualidadeArSection municipioInicial={municipioInicial} />
            <QueimadasSection />
            <FontesIntegradasGrid />
        </div>
    );
}
