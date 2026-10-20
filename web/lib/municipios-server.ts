import { serverFetch } from './server-fetch';
import type { Municipio } from './types';

export function getMunicipiosServer(): Promise<Municipio[]> {
    return serverFetch<Municipio[]>('/municipios-goias', 86_400);
}
