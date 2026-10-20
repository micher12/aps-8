'use client';

import { Building2 } from 'lucide-react';
import type { Organizacao } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OPCOES_STATUS = [
    { value: 'TODOS', label: 'Todos os Status' },
    { value: 'ABERTA', label: 'Apenas Abertas' },
    { value: 'EM_TRATAMENTO', label: 'Em Tratamento' },
    { value: 'RESOLVIDA', label: 'Resolvidas' },
];

const OPCOES_GRAVIDADE = [
    { value: 'TODAS', label: 'Todas as Gravidades' },
    { value: 'CRITICA', label: 'Crítica' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'MEDIA', label: 'Média' },
    { value: 'BAIXA', label: 'Baixa' },
];

interface NcToolbarProps {
    orgId: string;
    onOrgChange: (value: string) => void;
    filtroStatus: string;
    onStatusChange: (value: string) => void;
    filtroGravidade: string;
    onGravidadeChange: (value: string) => void;
    organizacoes: Organizacao[] | undefined;
}

export function NcToolbar({
    orgId,
    onOrgChange,
    filtroStatus,
    onStatusChange,
    filtroGravidade,
    onGravidadeChange,
    organizacoes,
}: NcToolbarProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Select value={orgId} onValueChange={(v) => onOrgChange(v ?? '')}>
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

                <Select value={filtroStatus} onValueChange={(v) => onStatusChange(v ?? '')}>
                    <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Todos os Status">
                            {OPCOES_STATUS.find((s) => s.value === filtroStatus)?.label ?? 'Todos os Status'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {OPCOES_STATUS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filtroGravidade} onValueChange={(v) => onGravidadeChange(v ?? '')}>
                    <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Todas as Gravidades">
                            {OPCOES_GRAVIDADE.find((g) => g.value === filtroGravidade)?.label ?? 'Todas as Gravidades'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {OPCOES_GRAVIDADE.map((g) => (
                            <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
