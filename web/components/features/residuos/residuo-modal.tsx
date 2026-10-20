'use client';

import { Loader2 } from 'lucide-react';
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
import type { Organizacao, Residuo } from '@/lib/types';
import type { ResiduoForm } from './residuos-constantes';

const OPCOES_CLASSE = [
    { value: 'NAO_PERIGOSO', label: 'Não Perigoso (Classe II)' },
    { value: 'PERIGOSO', label: 'Perigoso (Classe I)' },
    { value: 'INFECTANTE', label: 'Infectante (Classe I-A)' },
];

const OPCOES_UNIDADE = [
    { value: 'kg', label: 'kg' },
    { value: 't', label: 't (ton)' },
    { value: 'L', label: 'L (litros)' },
    { value: 'm3', label: 'm³' },
];

interface ResiduoModalProps {
    aberto: boolean;
    onAbertoChange: (aberto: boolean) => void;
    form: ResiduoForm;
    onFormChange: (form: ResiduoForm) => void;
    orgId: string;
    onOrgIdChange: (valor: string) => void;
    organizacoes?: Organizacao[];
    editando: Residuo | null;
    onSalvar: () => void;
    salvando: boolean;
}

export function ResiduoModal({
    aberto,
    onAbertoChange,
    form,
    onFormChange,
    orgId,
    onOrgIdChange,
    organizacoes,
    editando,
    onSalvar,
    salvando,
}: ResiduoModalProps) {
    return (
        <Dialog open={aberto} onOpenChange={onAbertoChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        {editando ? 'Editar Resíduo' : 'Registrar Resíduo no Inventário'}
                    </DialogTitle>
                    <DialogDescription>
                        Lance resíduos gerados com sua devida classificação ambiental.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Organização *</Label>
                        <Select value={orgId} onValueChange={(v) => onOrgIdChange(v ?? '')}>
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
                        <Label htmlFor="tipo">Tipo de Resíduo *</Label>
                        <Input
                            id="tipo"
                            placeholder="Ex.: Óleo lubrificante usado, Sucata metálica, Papelão"
                            value={form.tipo}
                            onChange={(e) => onFormChange({ ...form, tipo: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Classe Normativa</Label>
                            <Select value={form.classe} onValueChange={(v) => onFormChange({ ...form, classe: v ?? '' })}>
                                <SelectTrigger className="h-9 w-full text-sm">
                                    <SelectValue placeholder="Selecione a classe…">
                                        {OPCOES_CLASSE.find((c) => c.value === form.classe)?.label ?? 'Selecione a classe…'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {OPCOES_CLASSE.map((c) => (
                                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="quantidade">Qtd *</Label>
                                <Input
                                    id="quantidade"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={form.quantidade}
                                    onChange={(e) => onFormChange({ ...form, quantidade: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Unidade</Label>
                                <Select value={form.unidade} onValueChange={(v) => onFormChange({ ...form, unidade: v ?? '' })}>
                                    <SelectTrigger className="h-9 w-full text-sm">
                                        <SelectValue placeholder="Un.">
                                            {OPCOES_UNIDADE.find((u) => u.value === form.unidade)?.label ?? 'Un.'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {OPCOES_UNIDADE.map((u) => (
                                            <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="destinacao">Destinação Final *</Label>
                        <Input
                            id="destinacao"
                            placeholder="Ex.: Rerrefino, Reciclagem, Coprocessamento, Aterro Sanitário"
                            value={form.destinacao}
                            onChange={(e) => onFormChange({ ...form, destinacao: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="destinatario">Destinatário Final / Empresa Receptora</Label>
                        <Input
                            id="destinatario"
                            placeholder="Razão social da empresa receptora licenciada"
                            value={form.destinatario}
                            onChange={(e) => onFormChange({ ...form, destinatario: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onAbertoChange(false)} type="button">
                        Cancelar
                    </Button>
                    <Button
                        onClick={onSalvar}
                        disabled={salvando || !orgId || !form.tipo || !form.quantidade}
                        className="pressable gap-2"
                    >
                        {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
                        {editando ? 'Salvar Alterações' : 'Registrar no Inventário'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
