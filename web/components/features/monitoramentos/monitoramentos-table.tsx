import { useState } from 'react';
import { Activity, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Monitoramento } from '@/lib/types';
import { ROTULOS } from './rotulos';

interface MonitoramentosTableProps {
    dados: Monitoramento[];
    isPending: boolean;
    podeEscrever: boolean;
    onEditar: (m: Monitoramento) => void;
    onExcluir: (id: number) => void;
    excluindo: boolean;
}

export function MonitoramentosTable({
    dados,
    isPending,
    podeEscrever,
    onEditar,
    onExcluir,
    excluindo,
}: MonitoramentosTableProps) {
    const [pendente, setPendente] = useState<{ id: number; rotulo: string } | null>(null);
    return (
        <Card className="border-border/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="font-semibold text-foreground">Indicador / Tipo</TableHead>
                            <TableHead className="text-right font-semibold text-foreground">Valor Medido</TableHead>
                            <TableHead className="font-semibold text-foreground">Data da Medição</TableHead>
                            <TableHead className="font-semibold text-foreground">Observações Técnicas</TableHead>
                            {podeEscrever && (
                                <TableHead className="text-right font-semibold text-foreground">Ações</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-28 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    {podeEscrever && <TableCell className="text-right"><Skeleton className="ml-auto h-7 w-20" /></TableCell>}
                                </TableRow>
                            ))
                        ) : dados.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={podeEscrever ? 5 : 4} className="py-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Activity className="h-8 w-8 text-muted-foreground/50" />
                                        <p className="text-sm font-medium">Nenhuma medição encontrada</p>
                                        <p className="text-xs text-muted-foreground">
                                            Lance as leituras mensais de recursos no botão acima.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            dados.map((m) => {
                                const meta = ROTULOS[m.tipo];
                                const Icone = meta?.icon ?? Activity;
                                return (
                                    <TableRow key={m.id} className="border-border/60 hover:bg-muted/40 transition-colors">
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={`gap-1.5 text-[11px] font-semibold ${meta?.cor ?? ''}`}
                                            >
                                                <Icone className="h-3 w-3" />
                                                {meta?.label ?? m.tipo}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-sm font-semibold tabular text-foreground">
                                            {m.valor.toLocaleString('pt-BR')} {m.unidade}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground tabular">
                                            {new Date(m.dataMedicao + 'T00:00:00').toLocaleDateString('pt-BR')}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {m.observacao || '—'}
                                        </TableCell>
                                        {podeEscrever && (
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEditar(m)}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                        title="Editar medição"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setPendente({ id: m.id, rotulo: `${m.valor.toLocaleString('pt-BR')} ${m.unidade}` })}
                                                        disabled={excluindo}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        title="Remover medição"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
            <AlertDialog open={pendente !== null} onOpenChange={(aberto) => { if (!aberto) setPendente(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover medição?</AlertDialogTitle>
                        <AlertDialogDescription>
                            A medição de &quot;{pendente?.rotulo}&quot; será removida permanentemente. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={excluindo}
                            onClick={() => {
                                if (pendente) onExcluir(pendente.id);
                                setPendente(null);
                            }}
                        >
                            Remover
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
