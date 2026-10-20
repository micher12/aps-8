import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIA_BADGE, CATEGORIAS } from './categoria';

const OPCOES_CATEGORIA = [
    { value: 'TODAS', label: 'Todas as Categorias' },
    ...CATEGORIAS.map((c) => ({ value: c, label: CATEGORIA_BADGE[c].label })),
];

interface StakeholdersToolbarProps {
    termoBusca: string;
    onTermoBuscaChange: (valor: string) => void;
    filtroCategoria: string;
    onFiltroCategoriaChange: (valor: string) => void;
}

export function StakeholdersToolbar({
    termoBusca,
    onTermoBuscaChange,
    filtroCategoria,
    onFiltroCategoriaChange,
}: StakeholdersToolbarProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nome, categoria ou contato…"
                    value={termoBusca}
                    onChange={(e) => onTermoBuscaChange(e.target.value)}
                    className="pl-9 h-9 bg-card/60"
                />
            </div>

            <div className="flex items-center gap-2">
                <Select value={filtroCategoria} onValueChange={(v) => onFiltroCategoriaChange(v ?? '')}>
                    <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Todas as Categorias">
                            {OPCOES_CATEGORIA.find((c) => c.value === filtroCategoria)?.label ?? 'Todas as Categorias'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {OPCOES_CATEGORIA.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                                {c.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
