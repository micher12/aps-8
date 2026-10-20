import { useState } from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';
import type { Aspecto } from '@/lib/types';
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

interface AspectosTableProps {
    aspectos: Aspecto[];
    isPending: boolean;
    podeEscrever: boolean;
    onExcluir: (id: number) => void;
    excluindo: boolean;
}

export function AspectosTable({ aspectos, isPending, podeEscrever, onExcluir, excluindo }: AspectosTableProps) {
    const [pendente, setPendente] = useState<{ id: number; rotulo: string } | null>(null);
    return (
        <Card className="border-border/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="font-semibold text-foreground">Aspecto Ambiental (Causa)</TableHead>
                            <TableHead className="font-semibold text-foreground">Tipo de Atividade</TableHead>
                            <TableHead className="font-semibold text-foreground">Impacto Ambiental (Efeito)</TableHead>
                            <TableHead className="text-center font-semibold text-foreground">Cálculo F × G × P</TableHead>
                            <TableHead className="text-center font-semibold text-foreground">Grau de Significância</TableHead>
                            {podeEscrever && (
                                <TableHead className="text-right font-semibold text-foreground">Ações</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="mx-auto h-4 w-16" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="mx-auto h-6 w-20 rounded-full" /></TableCell>
                                    {podeEscrever && <TableCell className="text-right"><Skeleton className="ml-auto h-7 w-9" /></TableCell>}
                                </TableRow>
                            ))
                        ) : aspectos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={podeEscrever ? 6 : 5} className="py-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <ShieldAlert className="h-8 w-8 text-muted-foreground/50" />
                                        <p className="text-sm font-medium">Nenhum aspecto ambiental encontrado</p>
                                        <p className="text-xs text-muted-foreground">
                                            Tente ajustar os critérios de busca ou filtros.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            aspectos.map((a) => {
                                const isCritico = a.grauSignificancia >= 60;
                                const isModerado = a.grauSignificancia >= 36 && a.grauSignificancia < 60;
                                return (
                                    <TableRow key={a.id} className="border-border/60 hover:bg-muted/40 transition-colors">
                                        <TableCell className="font-medium text-foreground">
                                            {a.descricao}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            <Badge variant="outline" className="border-border font-normal text-[11px]">
                                                {a.tipo}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-foreground">
                                            {a.impacto}
                                        </TableCell>
                                        <TableCell className="text-center font-mono text-xs text-muted-foreground tabular">
                                            {a.frequencia} × {a.gravidade} × {a.probabilidade}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="secondary"
                                                className={`tabular font-mono text-xs font-bold px-2.5 py-0.5 ${
                                                    isCritico
                                                        ? 'bg-destructive/15 text-destructive border-destructive/20'
                                                        : isModerado
                                                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                                                          : 'bg-primary/15 text-primary border-primary/20'
                                                }`}
                                            >
                                                {a.grauSignificancia} pts
                                            </Badge>
                                        </TableCell>
                                        {podeEscrever && (
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setPendente({ id: a.id, rotulo: a.descricao })}
                                                    disabled={excluindo}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    title="Remover aspecto"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
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
                        <AlertDialogTitle>Remover aspecto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            O aspecto &quot;{pendente?.rotulo}&quot; será removido permanentemente. Esta ação não pode ser desfeita.
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
