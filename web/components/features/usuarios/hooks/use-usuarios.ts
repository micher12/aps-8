'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUsuarios } from '@/lib/usuarios-api';
import { queryKeys } from '@/lib/queryKeys';
import type { UsuarioGestao } from '../tipos';

export function useUsuarios() {
    return useQuery<UsuarioGestao[]>({
        queryKey: queryKeys.usuarios,
        queryFn: fetchUsuarios,
    });
}
