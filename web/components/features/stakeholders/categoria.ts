import {
    Building,
    HeartHandshake,
    Landmark,
    TrendingUp,
    Briefcase,
    CircleDot,
    type LucideIcon,
} from 'lucide-react';

/** Categorias iguais ao enum Stakeholder.Categoria do backend. */
export const CATEGORIA_BADGE: Record<string, { label: string; icon: LucideIcon; cor: string }> = {
    ORGAO_PUBLICO: { label: 'Órgão Público', icon: Landmark, cor: 'bg-primary/15 text-primary border-primary/20' },
    COMUNIDADE: { label: 'Comunidade Local', icon: HeartHandshake, cor: 'bg-sky-500/15 text-sky-400 border-sky-500/20' },
    FORNECEDOR: { label: 'Cadeia de Fornecedores', icon: Building, cor: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
    COLABORADOR: { label: 'Colaboradores', icon: Briefcase, cor: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
    INVESTIDOR: { label: 'Investidores', icon: TrendingUp, cor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
    OUTRO: { label: 'Outros', icon: CircleDot, cor: 'bg-muted text-muted-foreground border-border' },
};

export const CATEGORIAS = Object.keys(CATEGORIA_BADGE);
