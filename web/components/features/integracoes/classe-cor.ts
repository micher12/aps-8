export const CLASSE_COR: Record<string, { label: string; cor: string }> = {
    BOA: { label: 'Boa', cor: 'bg-primary/15 text-primary border-primary/20' },
    MODERADA: { label: 'Moderada', cor: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
    RUIM: { label: 'Ruim', cor: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
    MUITO_RUIM: {
        label: 'Muito Ruim',
        cor: 'bg-destructive/15 text-destructive border-destructive/20',
    },
    INDISPONIVEL: { label: 'Indisponível', cor: 'bg-muted text-muted-foreground border-border' },
};
