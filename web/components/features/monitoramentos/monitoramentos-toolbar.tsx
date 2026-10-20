import { Building2 } from 'lucide-react';
import type { Organizacao } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OPCOES_INDICADOR } from './rotulos';

const OPCOES_TIPO = [
    { value: 'TODOS', label: 'Todos os Indicadores' },
    ...OPCOES_INDICADOR,
];

interface MonitoramentosToolbarProps {
    orgId: string;
    onOrgIdChange: (value: string) => void;
    organizacoes: Organizacao[] | undefined;
    filtroTipo: string;
    onFiltroTipoChange: (value: string) => void;
}

export function MonitoramentosToolbar({
    orgId,
    onOrgIdChange,
    organizacoes,
    filtroTipo,
    onFiltroTipoChange,
}: MonitoramentosToolbarProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Select value={orgId} onValueChange={(v) => onOrgIdChange(v ?? '')}>
                        <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="Todas as Organizações">
                                {organizacoes?.find((o) => String(o.id) === orgId)?.razaoSocial ?? 'Todas as Organizações'}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Todas as Organizações</SelectItem>
                            {organizacoes?.map((o) => (
                                <SelectItem key={o.id} value={String(o.id)}>
                                    {o.razaoSocial}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Select value={filtroTipo} onValueChange={(v) => onFiltroTipoChange(v ?? '')}>
                    <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Todos os Indicadores">
                            {OPCOES_TIPO.find((t) => t.value === filtroTipo)?.label ?? 'Todos os Indicadores'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {OPCOES_TIPO.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
