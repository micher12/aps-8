'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import type { Licenca, Organizacao } from '@/lib/types';

const OPCOES_TIPO = [
    { value: 'LP', label: 'LP — Prévia' },
    { value: 'LI', label: 'LI — Instalação' },
    { value: 'LO', label: 'LO — Operação' },
    { value: 'LAS', label: 'LAS — Simplificada' },
];

export const VAZIO = {
    numero: '',
    tipo: 'LO',
    orgaoEmissor: '',
    dataEmissao: '',
    dataValidade: '',
    observacao: '',
};

export type LicencaForm = typeof VAZIO;

interface LicencaModalProps {
    aberto: boolean;
    onAbertoChange: (aberto: boolean) => void;
    form: LicencaForm;
    onFormChange: (form: LicencaForm) => void;
    orgId: string;
    onOrgIdChange: (valor: string) => void;
    organizacoes?: Organizacao[];
    editando: Licenca | null;
    onSalvar: () => void;
    salvando: boolean;
}

export function LicencaModal({
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
}: LicencaModalProps) {
    return (
        <Dialog open={aberto} onOpenChange={onAbertoChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        {editando ? `Editar Licença ${editando.numero}` : 'Nova Licença Ambiental'}
                    </DialogTitle>
                    <DialogDescription>
                        Registre licenças LP, LI e LO com seus prazos de validade.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label>Organização *</Label>
                        <Select value={orgId} onValueChange={(v) => onOrgIdChange(v ?? '')}>
                            <SelectTrigger className="h-9 w-full text-sm">
                                <SelectValue placeholder="Selecione a organização…" >
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

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="lic-numero">Número *</Label>
                            <Input
                                id="lic-numero"
                                placeholder="Ex.: LO 123/2024"
                                value={form.numero}
                                onChange={(e) => onFormChange({ ...form, numero: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Tipo *</Label>
                            <Select value={form.tipo} onValueChange={(v) => onFormChange({ ...form, tipo: v ?? '' })}>
                                <SelectTrigger className="h-9 w-full text-sm">
                                    <SelectValue placeholder="Selecione o tipo…">
                                        {OPCOES_TIPO.find((t) => t.value === form.tipo)?.label ?? 'Selecione o tipo…'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {OPCOES_TIPO.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="lic-orgao">Órgão Emissor</Label>
                        <Input
                            id="lic-orgao"
                            placeholder="Ex.: SEMAD-GO, IBAMA"
                            value={form.orgaoEmissor}
                            onChange={(e) => onFormChange({ ...form, orgaoEmissor: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Data de Emissão *</Label>
                            <DatePicker
                                value={form.dataEmissao}
                                onChange={(v) => onFormChange({ ...form, dataEmissao: v })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Data de Validade *</Label>
                            <DatePicker
                                value={form.dataValidade}
                                onChange={(v) => onFormChange({ ...form, dataValidade: v })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="lic-obs">Observação</Label>
                        <Input
                            id="lic-obs"
                            placeholder="Condicionantes, processo, etc."
                            value={form.observacao}
                            onChange={(e) => onFormChange({ ...form, observacao: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onAbertoChange(false)} type="button">
                        Cancelar
                    </Button>
                    <Button
                        onClick={onSalvar}
                        disabled={salvando || !orgId || !form.numero || !form.dataEmissao || !form.dataValidade}
                        className="pressable gap-2"
                    >
                        {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
                        {editando ? 'Salvar Alterações' : 'Registrar Licença'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
