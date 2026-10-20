import { serverFetch } from './server-fetch';
import type { Licenca } from './types';

export function getLicencasServer(): Promise<Licenca[]> {
    return serverFetch<Licenca[]>('/licencas', 60);
}
