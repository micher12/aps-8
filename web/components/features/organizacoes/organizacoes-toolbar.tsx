'use client';

import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OPCOES_PORTE = [
    { value: 'TODOS', label: 'Todos os Portes' },
    { value: 'MEI', label: 'MEI' },
    { value: 'ME', label: 'Microempresa (ME)' },
    { value: 'EPP', label: 'EPP' },
    { value: 'MEDIO', label: 'Médio Porte' },
    { value: 'GRANDE', label: 'Grande Porte' },
];

interface OrganizacoesToolbarProps {
    termoBusca: string;
    onTermoBuscaChange: (valor: string) => void;
    filtroPorte: string;
    onFiltroPorteChange: (valor: string) => void;
}

export function OrganizacoesToolbar({
    termoBusca,
    onTermoBuscaChange,
    filtroPorte,
    onFiltroPorteChange,
}: OrganizacoesToolbarProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar por razão social, CNPJ, setor ou município…"
                    value={termoBusca}
                    onChange={(e) => onTermoBuscaChange(e.target.value)}
                    className="pl-9 h-9 bg-card/60"
                />
            </div>

            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filtroPorte} onValueChange={(v) => onFiltroPorteChange(v ?? '')}>
                    <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Todos os Portes">
                            {OPCOES_PORTE.find((p) => p.value === filtroPorte)?.label ?? 'Todos os Portes'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {OPCOES_PORTE.map((p) => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
