import { api } from '@/lib/api';
import type { Municipio, QualidadeAr, QueimadasResumo } from '@/lib/types';
import { fetchMunicipios } from '@/lib/municipios-api';

export type { Municipio };
export { fetchMunicipios };

/** Fetchers client (DIP: hooks dependem daqui, não de `fetch` cru). */
export function fetchQualidadeAr(municipio: string): Promise<QualidadeAr> {
    return api
        .get<QualidadeAr>(`/integracoes/qualidade-ar?municipio=${municipio}`)
        .then((r) => r.dados);
}

export function fetchQueimadas(): Promise<QueimadasResumo> {
    return api.get<QueimadasResumo>('/integracoes/queimadas').then((r) => r.dados);
}
