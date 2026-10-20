import { api } from '@/lib/api';
import type { Usuario } from '@/lib/types';

export function fetchUsuarios(): Promise<Usuario[]> {
    return api.get<Usuario[]>('/usuarios').then((r) => r.dados);
}
