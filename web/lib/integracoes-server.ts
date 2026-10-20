import 'server-only';

import { serverFetch } from './server-fetch';
import type { Municipio, QualidadeAr } from './types';
import type { FocoQueimada } from './types';
import { getMunicipiosServer } from './municipios-server';

export { getMunicipiosServer };

/** staleTime espelham os hooks client (ar 1h / queimadas 30min). */
export function getQualidadeArServer(municipio: string): Promise<QualidadeAr> {
    return serverFetch<QualidadeAr>(`/integracoes/qualidade-ar?municipio=${municipio}`, 3_600);
}

export function getQueimadasServer(): Promise<{
    focos: FocoQueimada[];
    dadosIndisponiveis: boolean;
}> {
    return serverFetch('/integracoes/queimadas', 1_800);
}

export type { Municipio };
