'use client';

import { Search, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Organizacao } from '@/lib/types';

const OPCOES_CLASSE = [
    { value: 'TODAS', label: 'Todas as Classes' },
    { value: 'NAO_PERIGOSO', label: 'Não Perigosos' },
    { value: 'PERIGOSO', label: 'Perigosos' },
    { value: 'INFECTANTE', label: 'Infectantes' },
];

interface ResiduosToolbarProps {
    termoBusca: string;
    onTermoBuscaChange: (valor: string) => void;
    orgId: string;
    onOrgIdChange: (valor: string) => void;
    organizacoes?: Organizacao[];
    filtroClasse: string;
    onFiltroClasseChange: (valor: string) => void;
}

export function ResiduosToolbar({
    termoBusca,
    onTermoBuscaChange,
    orgId,
    onOrgIdChange,
    organizacoes,
    filtroClasse,
    onFiltroClasseChange,
}: ResiduosToolbarProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar por tipo de resíduo, destinação ou destinatário…"
                    value={termoBusca}
                    onChange={(e) => onTermoBuscaChange(e.target.value)}
                    className="pl-9 h-9 bg-card/60"
                />
            </div>

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

                <Select value={filtroClasse} onValueChange={(v) => onFiltroClasseChange(v ?? '')}>
                    <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Todas as Classes">
                            {OPCOES_CLASSE.find((c) => c.value === filtroClasse)?.label ?? 'Todas as Classes'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {OPCOES_CLASSE.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
