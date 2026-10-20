import { api } from '@/lib/api';
import type { Aspecto } from '@/lib/types';

export function fetchAspectos(): Promise<Aspecto[]> {
    return api.get<Aspecto[]>('/aspectos').then((r) => r.dados);
}
