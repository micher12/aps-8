import { serverFetch } from './server-fetch';
import type { Stakeholder } from './types';

export function getStakeholdersServer(): Promise<Stakeholder[]> {
    return serverFetch<Stakeholder[]>('/stakeholders', 60);
}
