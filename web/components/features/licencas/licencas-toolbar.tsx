'use client';

import { AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LicencasToolbarProps {
    termoBusca: string;
    onTermoBuscaChange: (valor: string) => void;
    apenasVencendo: boolean;
    onToggleVencendo: () => void;
    dias: number;
    onDiasChange: (dias: number) => void;
}

export function LicencasToolbar({
    termoBusca,
    onTermoBuscaChange,
    apenasVencendo,
    onToggleVencendo,
    dias,
    onDiasChange,
}: LicencasToolbarProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar por número, tipo (LP, LI, LO) ou órgão emissor…"
                    value={termoBusca}
                    onChange={(e) => onTermoBuscaChange(e.target.value)}
                    className="pl-9 h-9 bg-card/60"
                />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Button
                    variant={apenasVencendo ? 'default' : 'outline'}
                    size="sm"
                    onClick={onToggleVencendo}
                    className="pressable h-9 text-xs gap-1.5"
                >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Apenas Vencendo / Vencidas
                </Button>

                {apenasVencendo && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs">
                        <span className="text-muted-foreground">Janela:</span>
                        <Select value={String(dias)} onValueChange={(v) => { if (v !== null) onDiasChange(Number(v)); }}>
                            <SelectTrigger size="sm" className="border-0 bg-transparent p-0 text-xs font-medium shadow-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 dias</SelectItem>
                                <SelectItem value="30">30 dias</SelectItem>
                                <SelectItem value="60">60 dias</SelectItem>
                                <SelectItem value="90">90 dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
        </div>
    );
}
