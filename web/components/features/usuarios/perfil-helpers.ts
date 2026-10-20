import { Building2, ShieldCheck, UserCog } from 'lucide-react';

export const PERFIL_BADGES: Record<string, { label: string; cor: string; icon: typeof ShieldCheck }> = {
    ADMIN: { label: 'Administrador', cor: 'bg-destructive/15 text-destructive border-destructive/20', icon: ShieldCheck },
    GESTOR: { label: 'Gestor Ambiental', cor: 'bg-primary/15 text-primary border-primary/20', icon: Building2 },
    CONSULTOR: { label: 'Consultor Técnico', cor: 'bg-sky-500/15 text-sky-400 border-sky-500/20', icon: UserCog },
};

export const PERFIS = ['ADMIN', 'GESTOR', 'CONSULTOR'];

export function iniciais(nome?: string): string {
    if (!nome) return '?';
    return nome
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}
