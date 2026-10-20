'use client';

import { Recycle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import type { Residuo } from '@/lib/types';

interface ResiduosTableProps {
    residuos: Residuo[];
    isPending: boolean;
    podeEscrever: boolean;
    termoBusca: string;
    onEditar: (r: Residuo) => void;
    onExcluir: (r: Residuo) => void;
    excluirPending: boolean;
}

export function ResiduosTable({
    residuos,
    isPending,
    podeEscrever,
    termoBusca,
    onEditar,
    onExcluir,
    excluirPending,
}: ResiduosTableProps) {
    return (
        <Card className="border-border/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="font-semibold text-foreground">Tipo de Resíduo</TableHead>
                            <TableHead className="font-semibold text-foreground">Classe Normativa</TableHead>
                            <TableHead className="text-right font-semibold text-foreground">Quantidade</TableHead>
                            <TableHead className="font-semibold text-foreground">Destinação Final</TableHead>
                            <TableHead className="font-semibold text-foreground">Destinatário</TableHead>
                            <TableHead className="font-semibold text-foreground">Data Registro</TableHead>
                            {podeEscrever && (
                                <TableHead className="text-right font-semibold text-foreground">Ações</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    {podeEscrever && <TableCell className="text-right"><Skeleton className="ml-auto h-7 w-20" /></TableCell>}
                                </TableRow>
                            ))
                        ) : residuos.length === 0 ? (
                            <TableRow>
                                    <TableCell colSpan={podeEscrever ? 7 : 6} className="py-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Recycle className="h-8 w-8 text-muted-foreground/50" />
                                        <p className="text-sm font-medium">Nenhum resíduo registrado</p>
                                        <p className="text-xs text-muted-foreground">
                                            {termoBusca ? 'Tente outros filtros de busca.' : 'Lance os resíduos gerados no botão acima.'}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            residuos.map((r) => (
                                <TableRow key={r.id} className="border-border/60 hover:bg-muted/40 transition-colors">
                                    <TableCell className="font-medium text-foreground">
                                        {r.tipo}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={`text-[11px] font-semibold ${
                                                r.classe === 'PERIGOSO'
                                                    ? 'bg-destructive/15 text-destructive border-destructive/20'
                                                    : r.classe === 'INFECTANTE'
                                                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/20'
                                                      : 'bg-primary/15 text-primary border-primary/20'
                                            }`}
                                        >
                                            {r.classe === 'NAO_PERIGOSO' ? 'Não Perigoso' : r.classe === 'PERIGOSO' ? 'Perigoso' : 'Infectante'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xs font-semibold tabular text-foreground">
                                        {r.quantidade.toLocaleString('pt-BR')} {r.unidade}
                                    </TableCell>
                                    <TableCell className="text-sm text-foreground">
                                        {r.destinacao}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {r.destinatario || '—'}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground tabular">
                                        {new Date(r.dataRegistro + 'T00:00:00').toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    {podeEscrever && (
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEditar(r)}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                    title="Editar resíduo"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onExcluir(r)}
                                                    disabled={excluirPending}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    title="Remover resíduo"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
