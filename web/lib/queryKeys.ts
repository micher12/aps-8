export const queryKeys = {
    organizacoes: ['organizacoes'] as const,
    organizacao: (id: number) => ['organizacoes', id] as const,
    municipios: ['municipios-goias'] as const,
    licencas: (orgId?: number) => ['licencas', orgId ?? 'todas'] as const,
    licencasLista: (apenasVencendo: boolean, dias: number) =>
        ['licencas', apenasVencendo ? `vencendo-${dias}` : 'todas'] as const,
    licencasVencendo: (dias = 30) => ['licencas', `vencendo-${dias}`] as const,
    residuos: (orgId?: number) => ['residuos', orgId ?? 'todas'] as const,
    monitoramentos: (orgId?: number) => ['monitoramentos', orgId ?? 'todas'] as const,
    naoConformidades: (orgId?: number) => ['nao-conformidades', orgId ?? 'todas'] as const,
    acoesCorretivas: (ncId: number | null | undefined) => ['acoes-corretivas', ncId] as const,
    aspectos: ['aspectos'] as const,
    stakeholders: ['stakeholders'] as const,
    usuarios: ['usuarios'] as const,
    dashboardResumo: (orgId?: number) => ['dashboard', 'resumo', orgId ?? 'todas'] as const,
    qualidadeAr: (municipioId: string | number) => ['integracoes', 'qualidade-ar', municipioId] as const,
    queimadas: ['integracoes', 'queimadas'] as const,
};
