import { api } from '@/lib/api';
import type { Municipio } from '@/lib/types';

/** Fetcher client compartilhado (DIP: hooks de features dependem daqui). */
export function fetchMunicipios(): Promise<Municipio[]> {
    return api.get<Municipio[]>('/municipios-goias').then((r) => r.dados);
}
