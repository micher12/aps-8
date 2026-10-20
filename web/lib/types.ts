// Tipos TS espelhando os DTOs do backend (seção 16.2 do plano)
export type Perfil = 'ADMIN' | 'GESTOR' | 'CONSULTOR';
export type Porte = 'MEI' | 'ME' | 'EPP' | 'MEDIO' | 'GRANDE';
export type TipoMonitoramento = 'AGUA' | 'ENERGIA' | 'CO2';

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    perfil: Perfil;
    ativo: boolean;
}

export interface LoginResponse {
    sucesso: boolean;
    token: string;
    usuario: Usuario;
}

export interface Organizacao {
    id: number;
    razaoSocial: string;
    cnpj: string | null;
    setor: string | null;
    porte: Porte | null;
    municipioId: number | null;
    municipioNome: string | null;
    logradouro: string | null;
    cep: string | null;
    latitude: number | null;
    longitude: number | null;
}

export interface Municipio {
    codigoIbge: number;
    nome: string;
}

export interface Residuo {
    id: number;
    organizacaoId: number;
    tipo: string;
    classe: 'PERIGOSO' | 'NAO_PERIGOSO' | 'INFECTANTE';
    quantidade: number;
    unidade: string;
    destinacao: string;
    destinatario: string | null;
    dataRegistro: string;
}

export interface Licenca {
    id: number;
    organizacaoId: number;
    numero: string;
    tipo: string;
    orgaoEmissor: string;
    dataEmissao: string;
    dataValidade: string;
    diasParaVencimento: number;
    vencida: boolean;
    observacao: string | null;
}

export interface Monitoramento {
    id: number;
    organizacaoId: number;
    tipo: TipoMonitoramento;
    valor: number;
    unidade: string;
    dataMedicao: string;
    observacao: string | null;
}

export interface NaoConformidade {
    id: number;
    organizacaoId: number;
    descricao: string;
    origem: string;
    gravidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
    status: 'ABERTA' | 'EM_TRATAMENTO' | 'RESOLVIDA';
    dataAbertura: string;
}

export interface AcaoCorretiva {
    id: number;
    naoConformidadeId: number;
    descricao: string;
    responsavel: string;
    prazo: string | null;
    status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
}

export interface Aspecto {
    id: number;
    organizacaoId: number;
    descricao: string;
    tipo: string;
    impacto: string;
    frequencia: number;
    gravidade: number;
    probabilidade: number;
    grauSignificancia: number;
}

export type CategoriaStakeholder =
    | 'COLABORADOR'
    | 'FORNECEDOR'
    | 'COMUNIDADE'
    | 'ORGAO_PUBLICO'
    | 'INVESTIDOR'
    | 'OUTRO';

export interface Stakeholder {
    id: number;
    organizacaoId: number;
    nome: string;
    categoria: string;
    contato: string | null;
}

export interface DashboardResumo {
    totalOrganizacoes: number;
    consumoAguaMes: number;
    consumoEnergiaMes: number;
    emissaoCo2Mes: number;
    licencasVencendo: number;
    ncsAbertas: number;
    historicoMensal: { mes: string; tipo: string; valor: number }[];
}

export interface QualidadeAr {
    codigoIbge: number;
    pm25: number | null;
    pm10: number | null;
    co: number | null;
    o3: number | null;
    classificacao: string;
    dadosIndisponiveis: boolean;
}

export interface FocoQueimada {
    latitude: number;
    longitude: number;
    brilho: string;
    satelite: string;
    dataHora: string;
}

export interface QueimadasResumo {
    focos: FocoQueimada[];
    dadosIndisponiveis: boolean;
}

export interface ApiResponseOk<T> {
    sucesso: true;
    dados: T;
    paginacao?: { pagina: number; porPagina: number; total: number; totalPaginas: number };
}

export interface ApiErrorBody {
    sucesso: false;
    erro: { codigo: string; mensagem: string; detalhes?: Record<string, string> };
}
