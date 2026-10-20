'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Pencil, Power, Users, XCircle } from 'lucide-react';
import { useUsuario } from '@/lib/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { PERFIL_BADGES, iniciais } from './perfil-helpers';
import type { UsuarioGestao } from './tipos';

interface UsuariosTableProps {
    dados: UsuarioGestao[];
    isPending: boolean;
    onEditar: (u: UsuarioGestao) => void;
    onAlternar: (u: UsuarioGestao) => void;
    alternando: boolean;
}

export function UsuariosTable({ dados, isPending, onEditar, onAlternar, alternando }: UsuariosTableProps) {
    const eu = useUsuario();
    const [alvo, setAlvo] = useState<UsuarioGestao | null>(null);
    // Defesa em profundidade: o backend exige ROLE_ADMIN no PATCH/PUT; sem ela,
    // as ações nem aparecem (a página já mostra Acesso Restrito no 403 da lista).
    const podeGerir = eu?.perfil === 'ADMIN';

    function confirmar() {
        if (alvo && !alternando) {
            onAlternar(alvo);
            setAlvo(null);
        }
    }

    return (
        <>
        <Card className="border-border/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="font-semibold text-foreground">Usuário</TableHead>
                            <TableHead className="font-semibold text-foreground">E-mail Institucional</TableHead>
                            <TableHead className="font-semibold text-foreground">Perfil de Acesso</TableHead>
                            <TableHead className="font-semibold text-foreground">Status</TableHead>
                            <TableHead className="text-right font-semibold text-foreground">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-10 w-44" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="ml-auto h-7 w-20" /></TableCell>
                                </TableRow>
                            ))
                        ) : dados.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Users className="h-8 w-8 text-muted-foreground/50" />
                                        <p className="text-sm font-medium">Nenhum usuário encontrado</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            dados.map((u) => {
                                const meta = PERFIL_BADGES[u.perfil] ?? {
                                    label: u.perfil,
                                    cor: 'bg-muted text-muted-foreground border-border',
                                    icon: Users,
                                };
                                const Icone = meta.icon;
                                const souEu = eu?.email?.toLowerCase() === u.email.toLowerCase();

                                return (
                                    <TableRow key={u.id} className="border-border/60 hover:bg-muted/40 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-border">
                                                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                        {iniciais(u.nome)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-foreground">
                                                    {u.nome}
                                                    {souEu && (
                                                        <span className="ml-2 text-[10px] font-normal text-muted-foreground">(você)</span>
                                                    )}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {u.email}
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
                                        <TableCell>
                                            {u.ativo ? (
                                                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-[10px] gap-1">
                                                    <CheckCircle2 className="h-2.5 w-2.5" />
                                                    Ativo
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-muted-foreground/30 bg-muted/40 text-muted-foreground text-[10px] gap-1">
                                                    <XCircle className="h-2.5 w-2.5" />
                                                    Inativo
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {podeGerir ? (
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEditar(u)}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                    title="Editar nome e perfil"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setAlvo(u)}
                                                    disabled={alternando || souEu}
                                                    className={`h-8 w-8 p-0 ${u.ativo ? 'text-muted-foreground hover:text-destructive hover:bg-destructive/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
                                                    title={souEu ? 'Não é possível alterar a própria conta' : u.ativo ? 'Desativar acesso' : 'Reativar acesso'}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            ) : (
                                                <span className="tabular font-mono text-[11px] text-muted-foreground">
                                                    Sem ação
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>

            <AlertDialog open={alvo !== null} onOpenChange={(aberto) => { if (!aberto) setAlvo(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <p className="tabular font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            {alvo?.ativo ? 'Corretiva · Desativar acesso' : 'Corretiva · Reativar acesso'}
                        </p>
                        <AlertDialogTitle className="text-xl font-bold tracking-[-0.02em]">
                            {alvo?.ativo ? 'Desativar' : 'Reativar'} {alvo?.nome}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {alvo?.ativo
                                ? `A conta ${alvo?.email} perde o acesso imediatamente e as sessões ativas deixam de valer. A ação pode ser revertida.`
                                : `A conta ${alvo?.email} volta a autenticar com o perfil atual. Verifique o perfil antes de confirmar.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={alternando}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            variant={alvo?.ativo ? 'destructive' : 'default'}
                            onClick={confirmar}
                            disabled={alternando}
                        >
                            {alternando && <Loader2 className="h-4 w-4 animate-spin" />}
                            {alvo?.ativo ? 'Desativar acesso' : 'Reativar acesso'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
