import { useState } from 'react';
import { UsersRound, Mail, Trash2 } from 'lucide-react';
import type { Stakeholder } from '@/lib/types';
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
import { CATEGORIA_BADGE } from './categoria';

interface StakeholdersTableProps {
    stakeholders: Stakeholder[];
    isPending: boolean;
    podeEscrever: boolean;
    onExcluir: (id: number) => void;
    excluindo: boolean;
}

export function StakeholdersTable({ stakeholders, isPending, podeEscrever, onExcluir, excluindo }: StakeholdersTableProps) {
    const [pendente, setPendente] = useState<{ id: number; rotulo: string } | null>(null);
    return (
        <Card className="border-border/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="font-semibold text-foreground">Parte Interessada (Nome)</TableHead>
                            <TableHead className="font-semibold text-foreground">Categoria</TableHead>
                            <TableHead className="font-semibold text-foreground">Canal de Contato</TableHead>
                            {podeEscrever && (
                                <TableHead className="text-right font-semibold text-foreground">Ações</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-28 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    {podeEscrever && <TableCell className="text-right"><Skeleton className="ml-auto h-7 w-9" /></TableCell>}
                                </TableRow>
                            ))
                        ) : stakeholders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={podeEscrever ? 4 : 3} className="py-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <UsersRound className="h-8 w-8 text-muted-foreground/50" />
                                        <p className="text-sm font-medium">Nenhum stakeholder encontrado</p>
                                        <p className="text-xs text-muted-foreground">
                                            Tente ajustar os critérios de busca.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            stakeholders.map((s) => {
                                const meta = CATEGORIA_BADGE[s.categoria.toUpperCase()] ?? {
                                    label: s.categoria,
                                    icon: UsersRound,
                                    cor: 'bg-muted text-muted-foreground border-border',
                                };
                                const Icone = meta.icon;
                                return (
                                    <TableRow key={s.id} className="border-border/60 hover:bg-muted/40 transition-colors">
                                        <TableCell className="font-medium text-foreground">
                                            {s.nome}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={`gap-1.5 text-[11px] font-semibold ${meta.cor}`}
                                            >
                                                <Icone className="h-3 w-3" />
                                                {meta.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {s.contato ? (
                                                <span className="flex items-center gap-1.5 font-mono text-xs text-foreground">
                                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {s.contato}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground/60">—</span>
                                            )}
                                        </TableCell>
                                        {podeEscrever && (
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setPendente({ id: s.id, rotulo: s.nome })}
                                                    disabled={excluindo}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    title="Remover stakeholder"
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
                        <AlertDialogTitle>Remover stakeholder?</AlertDialogTitle>
                        <AlertDialogDescription>
                            A parte interessada &quot;{pendente?.rotulo}&quot; será removida permanentemente. Esta ação não pode ser desfeita.
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
