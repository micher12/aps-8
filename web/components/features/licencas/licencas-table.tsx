'use client';

import { KeyRound, CheckCircle2, Clock, ShieldAlert, Pencil, Trash2 } from 'lucide-react';
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
import type { Licenca } from '@/lib/types';

interface LicencasTableProps {
    licencas: Licenca[];
    isPending: boolean;
    podeEscrever: boolean;
    isAdmin: boolean;
    termoBusca: string;
    onEditar: (l: Licenca) => void;
    onExcluir: (l: Licenca) => void;
    excluirPending: boolean;
}

export function LicencasTable({
    licencas,
    isPending,
    podeEscrever,
    isAdmin,
    termoBusca,
    onEditar,
    onExcluir,
    excluirPending,
}: LicencasTableProps) {
    return (
        <Card className="border-border/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="font-semibold text-foreground">Número da Licença</TableHead>
                            <TableHead className="font-semibold text-foreground">Tipo</TableHead>
                            <TableHead className="font-semibold text-foreground">Órgão Emissor</TableHead>
                            <TableHead className="font-semibold text-foreground">Data de Validade</TableHead>
                            <TableHead className="font-semibold text-foreground">Situação / Prazo</TableHead>
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
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-32 rounded-full" /></TableCell>
                                    {podeEscrever && <TableCell className="text-right"><Skeleton className="ml-auto h-7 w-20" /></TableCell>}
                                </TableRow>
                            ))
                        ) : licencas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={podeEscrever ? 6 : 5} className="py-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <KeyRound className="h-8 w-8 text-muted-foreground/50" />
                                        <p className="text-sm font-medium">Nenhuma licença ambiental encontrada</p>
                                        <p className="text-xs text-muted-foreground">
                                            {termoBusca ? 'Tente outros filtros de busca.' : 'Não há registros com os critérios selecionados.'}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            licencas.map((l) => (
                                <TableRow key={l.id} className="border-border/60 hover:bg-muted/40 transition-colors">
                                    <TableCell className="font-mono text-xs font-semibold text-foreground tabular">
                                        {l.numero}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[11px] font-medium border-border">
                                            {l.tipo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {l.orgaoEmissor}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-foreground tabular">
                                        {new Date(l.dataValidade + 'T00:00:00').toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell>
                                        {l.vencida ? (
                                            <Badge className="bg-destructive/15 text-destructive border-destructive/20 gap-1 text-[11px]">
                                                <ShieldAlert className="h-3 w-3" />
                                                Vencida há {Math.abs(l.diasParaVencimento)} dias
                                            </Badge>
                                        ) : l.diasParaVencimento <= 30 ? (
                                            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 gap-1 text-[11px]">
                                                <Clock className="h-3 w-3" />
                                                Vence em {l.diasParaVencimento} dias
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-primary/15 text-primary border-primary/20 gap-1 text-[11px]">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Vigente ({l.diasParaVencimento}d restantes)
                                            </Badge>
                                        )}
                                    </TableCell>
                                    {podeEscrever && (
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEditar(l)}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                    title="Editar licença"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                {isAdmin && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onExcluir(l)}
                                                        disabled={excluirPending}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        title="Remover licença (ADMIN)"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
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
