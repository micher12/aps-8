import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PERFIL_BADGES, PERFIS } from './perfil-helpers';

const OPCOES_PERFIL = [
    { value: 'TODOS', label: 'Todos os Perfis' },
    ...PERFIS.map((p) => ({ value: p, label: PERFIL_BADGES[p].label })),
];

const OPCOES_STATUS = [
    { value: 'TODOS', label: 'Todos os Status' },
    { value: 'ATIVOS', label: 'Ativos' },
    { value: 'INATIVOS', label: 'Inativos' },
];

interface UsuariosToolbarProps {
    termoBusca: string;
    onTermoBuscaChange: (value: string) => void;
    filtroPerfil: string;
    onFiltroPerfilChange: (value: string) => void;
    filtroStatus: string;
    onFiltroStatusChange: (value: string) => void;
}

export function UsuariosToolbar({
    termoBusca,
    onTermoBuscaChange,
    filtroPerfil,
    onFiltroPerfilChange,
    filtroStatus,
    onFiltroStatusChange,
}: UsuariosToolbarProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nome ou e-mail institucional…"
                    value={termoBusca}
                    onChange={(e) => onTermoBuscaChange(e.target.value)}
                    className="pl-9 h-9 bg-card/60"
                />
            </div>

            <div className="flex items-center gap-2">
                <Select value={filtroPerfil} onValueChange={(v) => onFiltroPerfilChange(v ?? '')}>
                    <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Todos os Perfis">
                            {OPCOES_PERFIL.find((p) => p.value === filtroPerfil)?.label ?? 'Todos os Perfis'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {OPCOES_PERFIL.map((p) => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filtroStatus} onValueChange={(v) => onFiltroStatusChange(v ?? '')}>
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
            </div>
        </div>
    );
}
