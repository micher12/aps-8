import { api } from '@/lib/api';
import type { Stakeholder } from '@/lib/types';

export function fetchStakeholders(): Promise<Stakeholder[]> {
    return api.get<Stakeholder[]>('/stakeholders').then((r) => r.dados);
}
