'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { usePermissoes } from '@/lib/permissoes';
import type { AcaoCorretiva, NaoConformidade } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAcoesCorretivas } from './hooks/use-nao-conformidades';

const OPCOES_STATUS = [
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'EM_ANDAMENTO', label: 'Em andamento' },
    { value: 'CONCLUIDA', label: 'Concluída' },
];

interface AcoesModalProps {
    nc: NaoConformidade | null;
    onClose: () => void;
}

export function AcoesModal({ nc, onClose }: AcoesModalProps) {
    const qc = useQueryClient();
    const { podeEscrever } = usePermissoes();
    const [acaoForm, setAcaoForm] = useState({ descricao: '', responsavel: '', prazo: '', status: 'PENDENTE' });

    const { data: acoes, isPending: acoesPending } = useAcoesCorretivas(nc?.id ?? null, nc !== null);

    const criarAcao = useMutation({
        mutationFn: () =>
            api
                .post<AcaoCorretiva>('/acoes-corretivas', {
                    naoConformidadeId: nc!.id,
                    descricao: acaoForm.descricao,
                    responsavel: acaoForm.responsavel,
                    prazo: acaoForm.prazo || undefined,
                    status: acaoForm.status,
                })
                .then((r) => r.dados),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['acoes-corretivas', nc?.id] });
            toast.success('Ação corretiva registrada');
            setAcaoForm({ descricao: '', responsavel: '', prazo: '', status: 'PENDENTE' });
        },
        onError: (e: Error) => toast.error(`Erro ao registrar ação: ${e.message}`),
    });

    const excluirAcao = useMutation({
        mutationFn: (id: number) => api.delete(`/acoes-corretivas/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['acoes-corretivas', nc?.id] });
            toast.success('Ação corretiva removida');
        },
        onError: (e: Error) => toast.error(`Erro ao remover ação: ${e.message}`),
    });

    return (
        <Dialog open={nc !== null} onOpenChange={(aberto) => { if (!aberto) onClose(); }}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        Ações Corretivas — NC #{nc?.id}
                    </DialogTitle>
                    <DialogDescription>
                        {nc?.descricao}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    {acoesPending ? (
                        <Skeleton className="h-16 w-full rounded-lg" />
                    ) : !acoes || acoes.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                            Nenhuma ação corretiva registrada para esta NC.
                        </p>
                    ) : (
                        acoes.map((a) => (
                            <div key={a.id} className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-muted/20 p-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground">{a.descricao}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {a.responsavel}
                                        {a.prazo && ` · prazo ${new Date(a.prazo + 'T00:00:00').toLocaleDateString('pt-BR')}`}
                                        {` · ${a.status.replace('_', ' ')}`}
                                    </p>
                                </div>
                                {podeEscrever && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => excluirAcao.mutate(a.id)}
                                        disabled={excluirAcao.isPending}
                                        className="h-7 w-7 shrink-0 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        title="Remover ação"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {podeEscrever && (
                    <div className="space-y-3 rounded-lg border border-border/70 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Nova ação corretiva
                        </p>
                        <div className="space-y-1.5">
                            <Label htmlFor="acao-desc">Descrição *</Label>
                            <Input
                                id="acao-desc"
                                placeholder="Ex.: Instalar bacia de contenção na área 2"
                                value={acaoForm.descricao}
                                onChange={(e) => setAcaoForm({ ...acaoForm, descricao: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="acao-resp">Responsável *</Label>
                                <Input
                                    id="acao-resp"
                                    placeholder="Nome do responsável"
                                    value={acaoForm.responsavel}
                                    onChange={(e) => setAcaoForm({ ...acaoForm, responsavel: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Prazo</Label>
                                <DatePicker
                                    value={acaoForm.prazo}
                                    onChange={(v) => setAcaoForm({ ...acaoForm, prazo: v })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <Select value={acaoForm.status} onValueChange={(v) => setAcaoForm({ ...acaoForm, status: v ?? '' })}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Status">
                                        {OPCOES_STATUS.find((s) => s.value === acaoForm.status)?.label ?? 'Status'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {OPCOES_STATUS.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={() => criarAcao.mutate()}
                                disabled={criarAcao.isPending || !acaoForm.descricao || !acaoForm.responsavel}
                                className="pressable gap-2"
                                size="sm"
                            >
                                {criarAcao.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                Adicionar Ação
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
