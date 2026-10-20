'use client';

import { useState } from 'react';
import { Building2, Pencil, Trash2 } from 'lucide-react';
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
import { usePermissoes } from '@/lib/permissoes';
import type { Organizacao } from '@/lib/types';
import { formatarCnpj } from './formatacao';

interface OrganizacoesTableProps {
    organizacoes: Organizacao[];
    isPending: boolean;
    termoBusca: string;
    onEditar: (organizacao: Organizacao) => void;
    onRemover: (id: number) => void;
}

export function OrganizacoesTable({
    organizacoes,
    isPending,
    termoBusca,
    onEditar,
    onRemover,
}: OrganizacoesTableProps) {
    const { podeEscrever, isAdmin } = usePermissoes();
    const [pendente, setPendente] = useState<{ id: number; rotulo: string } | null>(null);

    return (
        <Card className="border-border/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="font-semibold text-foreground">Razão Social</TableHead>
                            <TableHead className="font-semibold text-foreground">CNPJ</TableHead>
                            <TableHead className="font-semibold text-foreground">Setor</TableHead>
                            <TableHead className="font-semibold text-foreground">Município (GO)</TableHead>
                            <TableHead className="font-semibold text-foreground">Porte</TableHead>
                            <TableHead className="text-right font-semibold text-foreground">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="ml-auto h-7 w-20" /></TableCell>
                                </TableRow>
                            ))
                        ) : organizacoes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Building2 className="h-8 w-8 text-muted-foreground/50" />
                                        <p className="text-sm font-medium">Nenhuma organização encontrada</p>
                                        <p className="text-xs text-muted-foreground">
                                            {termoBusca ? 'Tente ajustar os termos da busca.' : 'Cadastre sua primeira organização no botão acima.'}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            organizacoes.map((o) => (
                                <TableRow key={o.id} className="border-border/60 hover:bg-muted/40 transition-colors">
                                    <TableCell className="font-medium text-foreground">
                                        {o.razaoSocial}
                                        {o.logradouro && (
                                            <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                                                {o.logradouro}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground tabular">
                                        {formatarCnpj(o.cnpj)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs">
                                        {o.setor ?? '—'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs">
                                        {o.municipioNome ?? 'Goiás'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={`text-[11px] font-medium ${
                                                o.porte === 'GRANDE'
                                                    ? 'bg-primary/15 text-primary border-primary/20'
                                                    : o.porte === 'MEDIO'
                                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                      : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {o.porte ?? 'Não inf.'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {podeEscrever && (
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEditar(o)}
                                                className="pressable h-8 px-2 text-xs gap-1"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                                Editar
                                            </Button>
                                            {isAdmin && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setPendente({ id: o.id, rotulo: o.razaoSocial })}
                                                className="pressable h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                            )}
                                        </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <AlertDialog open={pendente !== null} onOpenChange={(aberto) => { if (!aberto) setPendente(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Desativar organização?</AlertDialogTitle>
                        <AlertDialogDescription>
                            A organização &quot;{pendente?.rotulo}&quot; será desativada e deixará de aparecer nas listagens.
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                if (pendente) onRemover(pendente.id);
                                setPendente(null);
                            }}
                        >
                            Desativar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
