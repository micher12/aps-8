import { useUsuario } from './auth';
import type { Perfil } from './types';

/**
 * Espelha as roles do backend (@PreAuthorize) na UI.
 * Backend continua sendo a autoridade (403); aqui só escondemos ações sem permissão.
 */
export function usePermissoes() {
    const usuario = useUsuario();
    const perfil = (usuario?.perfil ?? null) as Perfil | null;
    const isAdmin = perfil === 'ADMIN';
    // writes Conformidade/Licenças/Monitoramento/Organização/Resíduos: ADMIN + GESTOR
    const podeEscrever = perfil === 'ADMIN' || perfil === 'GESTOR';
    return { perfil, isAdmin, podeEscrever };
}
