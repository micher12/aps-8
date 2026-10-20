'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import type { Organizacao } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { GRAVIDADES } from './gravidades';

const OPCOES_ORIGEM = [
    { value: 'AUDITORIA_INTERNA', label: 'Auditoria Interna' },
    { value: 'AUDITORIA_EXTERNA', label: 'Auditoria Externa' },
    { value: 'FISCALIZACAO', label: 'Fiscalização Órgão' },
    { value: 'INCIDENTE', label: 'Incidente Operacional' },
];

interface NcModalProps {
    aberto: boolean;
    onAbertoChange: (aberto: boolean) => void;
    orgId: string;
    onOrgChange: (value: string) => void;
    organizacoes: Organizacao[] | undefined;
}

export function NcModal({ aberto, onAbertoChange, orgId, onOrgChange, organizacoes }: NcModalProps) {
    const qc = useQueryClient();
    const [form, setForm] = useState({
        descricao: '',
        origem: 'AUDITORIA_INTERNA',
        gravidade: 'BAIXA',
    });

    const criar = useMutation({
        mutationFn: () =>
            api.post('/nao-conformidades', {
                organizacaoId: Number(orgId),
                descricao: form.descricao,
                origem: form.origem,
                gravidade: form.gravidade,
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['nao-conformidades'] });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Não conformidade registrada com sucesso');
            setForm({ descricao: '', origem: 'AUDITORIA_INTERNA', gravidade: 'BAIXA' });
            onAbertoChange(false);
        },
        onError: (e: Error) => toast.error(`Erro ao criar: ${e.message}`),
    });

    return (
        <Dialog open={aberto} onOpenChange={onAbertoChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        Registrar Não Conformidade
                    </DialogTitle>
                    <DialogDescription>
                        Cadastre um desvio ou não conformidade identificada em auditoria ISO 14001.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Organização *</Label>
                        <Select value={orgId} onValueChange={(v) => onOrgChange(v ?? '')}>
                            <SelectTrigger className="h-9 w-full text-sm">
                                <SelectValue placeholder="Selecione a organização…">
                                    {organizacoes?.find((o) => String(o.id) === orgId)?.razaoSocial ?? 'Selecione a organização…'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {organizacoes?.map((o) => (
                                    <SelectItem key={o.id} value={String(o.id)}>
                                        {o.razaoSocial}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="descricao">Descrição do Desvio / Não Conformidade *</Label>
                        <Input
                            id="descricao"
                            placeholder="Ex.: Vazamento de óleo na bacia de contenção 2"
                            value={form.descricao}
                            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Origem do Registro</Label>
                            <Select value={form.origem} onValueChange={(v) => setForm({ ...form, origem: v ?? '' })}>
                                <SelectTrigger className="h-9 w-full text-sm">
                                    <SelectValue placeholder="Selecione a origem…">
                                        {OPCOES_ORIGEM.find((op) => op.value === form.origem)?.label ?? 'Selecione a origem…'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {OPCOES_ORIGEM.map((op) => (
                                        <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Gravidade</Label>
                            <Select value={form.gravidade} onValueChange={(v) => setForm({ ...form, gravidade: v ?? '' })}>
                                <SelectTrigger className="h-9 w-full text-sm">
                                    <SelectValue placeholder="Selecione a gravidade…">
                                        {GRAVIDADES.find((g) => g.id === form.gravidade)?.label ?? 'Selecione a gravidade…'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {GRAVIDADES.map((g) => (
                                        <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onAbertoChange(false)} type="button">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => criar.mutate()}
                        disabled={criar.isPending || !orgId || !form.descricao}
                        className="pressable gap-2"
                    >
                        {criar.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        Registrar Desvio
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
