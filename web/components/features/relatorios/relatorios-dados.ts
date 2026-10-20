import { FileSpreadsheet, FileText, type LucideIcon } from 'lucide-react';

export interface RelatorioInfo {
    id: string;
    nome: string;
    descricao: string;
    formato: string;
    icone: LucideIcon;
    badgeCor: string;
}

export const RELATORIOS: RelatorioInfo[] = [
    {
        id: 'residuos',
        nome: 'Inventário de Resíduos',
        descricao: 'Exportação tabular de geração, classes I e II, rastreamento de transporte e destinação final autorizada.',
        formato: 'csv',
        icone: FileSpreadsheet,
        badgeCor: 'bg-primary/15 text-primary border-primary/20',
    },
    {
        id: 'indicadores',
        nome: 'Monitoramentos & Consumo',
        descricao: 'Histórico consolidado de consumo de água (m³), energia elétrica (kWh) e pegada de emissões de CO₂.',
        formato: 'csv',
        icone: FileSpreadsheet,
        badgeCor: 'bg-primary/15 text-primary border-primary/20',
    },
    {
        id: 'conformidade',
        nome: 'Conformidade de Licenças Ambientais',
        descricao: 'Dossiê em PDF com status de vigência, prazos de renovação (SEMAD/IBAMA) e condicionantes legais.',
        formato: 'pdf',
        icone: FileText,
        badgeCor: 'bg-destructive/15 text-destructive border-destructive/20',
    },
    {
        id: 'integrado',
        nome: 'Relatório Ambiental Integrado (ISO 14001)',
        descricao: 'Documento completo unificando aspectos, resíduos, monitoramentos, não conformidades e governança.',
        formato: 'pdf',
        icone: FileText,
        badgeCor: 'bg-destructive/15 text-destructive border-destructive/20',
    },
];
