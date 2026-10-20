import { serverFetch } from './server-fetch';
import type { Aspecto } from './types';

export function getAspectosServer(): Promise<Aspecto[]> {
    return serverFetch<Aspecto[]>('/aspectos', 60);
}
