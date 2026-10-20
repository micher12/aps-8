import { FonteCard } from './fonte-card';

const FONTES = [
    {
        codigo: 'IBGE · Localidades',
        titulo: 'IBGE Localidades',
        descricao: 'Carga de todos os 246 municípios do estado de Goiás e códigos oficiais.',
    },
    {
        codigo: 'Receita · CNPJ',
        titulo: 'BrasilAPI',
        descricao: 'Autocompletar e validação cadastral da Receita Federal via CNPJ.',
    },
    {
        codigo: 'Atmosfera · Open-Meteo',
        titulo: 'Open-Meteo',
        descricao: 'Previsões e índices de poluição e particulados (PM2.5, PM10, CO) por coordenada.',
    },
    {
        codigo: 'Orbital · NASA FIRMS',
        titulo: 'NASA FIRMS',
        descricao:
            'Sensoriamento orbital de incêndios florestais e focos de calor no bioma Cerrado.',
    },
];

export function FontesIntegradasGrid() {
    return (
        <section aria-label="Fontes integradas" className="border-t border-border/70 pt-4">
            <div className="flex items-baseline justify-between gap-4">
                <div>
                    <p className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Fontes · Dados abertos
                    </p>
                    <h2 className="mt-1 text-lg font-bold tracking-[-0.02em] text-foreground">
                        Fontes integradas
                    </h2>
                </div>
                <p className="tabular hidden shrink-0 font-mono text-[11px] text-muted-foreground sm:block">
                    4 provedores ativos
                </p>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
                {FONTES.map((f) => (
                    <FonteCard key={f.titulo} {...f} />
                ))}
            </div>
        </section>
    );
}
