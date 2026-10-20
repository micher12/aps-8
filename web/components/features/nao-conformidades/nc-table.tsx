'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, ListChecks, ShieldAlert, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { usePermissoes } from '@/lib/permissoes';
import type { NaoConformidade } from '@/lib/types';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { GRAVIDADES } from './gravidades';

interface NcTableProps {
    filtradas: NaoConformidade[];
    isPending: boolean;
    onAcoes: (nc: NaoConformidade) => void;
}

export function NcTable({ filtradas, isPending, onAcoes }: NcTableProps) {
    const qc = useQueryClient();
    const { podeEscrever, isAdmin } = usePermissoes();
    const [pendente, setPendente] = useState<{ id: number; rotulo: string } | null>(null);

    const mudarStatus = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            api.put(`/nao-conformidades/${id}/status/${status}`, {}),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['nao-conformidades'] });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Status da não conformidade atualizado');
        },
        onError: (e: Error) => toast.error(`Erro ao atualizar: ${e.message}`),
    });

    const excluir = useMutation({
        mutationFn: (id: number) => api.delete(`/nao-conformidades/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['nao-conformidades'] });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Não conformidade removida');
        },
        onError: (e: Error) => toast.error(`Erro ao remover: ${e.message}`),
    });

    return (
        <Card className="border-border/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="font-semibold text-foreground">Descrição do Desvio</TableHead>
                            <TableHead className="font-semibold text-foreground">Origem</TableHead>
                            <TableHead className="font-semibold text-foreground">Gravidade</TableHead>
                            <TableHead className="font-semibold text-foreground">Status Atual</TableHead>
                            <TableHead className="font-semibold text-foreground">Data Abertura</TableHead>
                            <TableHead className="text-right font-semibold text-foreground">Ações Corretivas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-60" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="ml-auto h-7 w-24" /></TableCell>
                                </TableRow>
                            ))
                        ) : filtradas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <ShieldAlert className="h-8 w-8 text-muted-foreground/50" />
                                        <p className="text-sm font-medium">Nenhuma não conformidade registrada</p>
                                        <p className="text-xs text-muted-foreground">
                                            Excelente! Não há desvios ou infrações ativas para o filtro selecionado.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtradas.map((n) => {
                                const gravidadeObj = GRAVIDADES.find((g) => g.id === n.gravidade);
                                return (
                                    <TableRow key={n.id} className="border-border/60 hover:bg-muted/40 transition-colors">
                                        <TableCell className="font-medium text-foreground max-w-sm">
                                            <p className="truncate" title={n.descricao}>{n.descricao}</p>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {n.origem ? n.origem.replace('_', ' ') : '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={`text-[11px] font-semibold ${gravidadeObj?.cor ?? ''}`}
                                            >
                                                {gravidadeObj?.label ?? n.gravidade}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-[11px] font-medium ${
                                                    n.status === 'RESOLVIDA'
                                                        ? 'border-primary/40 bg-primary/10 text-primary'
                                                        : n.status === 'EM_TRATAMENTO'
                                                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                                                          : 'border-destructive/40 bg-destructive/10 text-destructive'
                                                }`}
                                            >
                                                {n.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground tabular">
                                            {new Date(n.dataAbertura + 'T00:00:00').toLocaleDateString('pt-BR')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {podeEscrever && n.status === 'ABERTA' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => mudarStatus.mutate({ id: n.id, status: 'EM_TRATAMENTO' })}
                                                        disabled={mudarStatus.isPending}
                                                        className="pressable h-8 text-xs gap-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                                                    >
                                                        Tratar
                                                        <ArrowRight className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                {podeEscrever && n.status === 'EM_TRATAMENTO' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => mudarStatus.mutate({ id: n.id, status: 'RESOLVIDA' })}
                                                        disabled={mudarStatus.isPending}
                                                        className="pressable h-8 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                                                    >
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Resolver
                                                    </Button>
                                                )}
                                                {n.status === 'RESOLVIDA' && !podeEscrever && (
                                                    <span className="text-xs text-primary font-medium flex items-center justify-end gap-1">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Concluída
                                                    </span>
                                                )}
                                                {podeEscrever && n.status === 'RESOLVIDA' && (
                                                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Concluída
                                                    </span>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onAcoes(n)}
                                                    className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
                                                    title="Plano de ações corretivas"
                                                >
                                                    <ListChecks className="h-4 w-4" />
                                                    Ações
                                                </Button>
                                                {isAdmin && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setPendente({ id: n.id, rotulo: `NC #${n.id}` })}
                                                        disabled={excluir.isPending}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        title="Remover NC (ADMIN)"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
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
                        <AlertDialogTitle>Remover não conformidade?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendente?.rotulo} será removida permanentemente. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={excluir.isPending}
                            onClick={() => {
                                if (pendente) excluir.mutate(pendente.id);
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
