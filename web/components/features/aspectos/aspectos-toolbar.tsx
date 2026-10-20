import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OPCOES_NIVEL = [
    { value: 'TODOS', label: 'Todos os Níveis de Significância' },
    { value: 'CRITICO', label: 'Crítico (F×G×P ≥ 60)' },
    { value: 'MODERADO', label: 'Moderado (36 a 59)' },
    { value: 'BAIXO', label: 'Baixo Impacto (< 36)' },
];

interface AspectosToolbarProps {
    termoBusca: string;
    onTermoBuscaChange: (valor: string) => void;
    filtroNivel: string;
    onFiltroNivelChange: (valor: string) => void;
}

export function AspectosToolbar({
    termoBusca,
    onTermoBuscaChange,
    filtroNivel,
    onFiltroNivelChange,
}: AspectosToolbarProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar por aspecto, impacto ou tipo de atividade…"
                    value={termoBusca}
                    onChange={(e) => onTermoBuscaChange(e.target.value)}
                    className="pl-9 h-9 bg-card/60"
                />
            </div>

            <div className="flex items-center gap-2">
                <Select value={filtroNivel} onValueChange={(v) => onFiltroNivelChange(v ?? '')}>
                    <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Todos os Níveis de Significância">
                            {OPCOES_NIVEL.find((n) => n.value === filtroNivel)?.label ?? 'Todos os Níveis de Significância'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {OPCOES_NIVEL.map((n) => (
                            <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
