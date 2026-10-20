import { Loader2 } from 'lucide-react';
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
import { CATEGORIA_BADGE, CATEGORIAS } from './categoria';

export interface StakeholderForm {
    nome: string;
    categoria: string;
    contato: string;
}

interface StakeholderModalProps {
    aberto: boolean;
    onAbertoChange: (aberto: boolean) => void;
    orgId: string;
    onOrgIdChange: (orgId: string) => void;
    form: StakeholderForm;
    onFormChange: (form: StakeholderForm) => void;
    organizacoes: Organizacao[] | undefined;
    onSubmit: () => void;
    salvando: boolean;
}

export function StakeholderModal({
    aberto,
    onAbertoChange,
    orgId,
    onOrgIdChange,
    form,
    onFormChange,
    organizacoes,
    onSubmit,
    salvando,
}: StakeholderModalProps) {
    return (
        <Dialog open={aberto} onOpenChange={onAbertoChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        Novo Stakeholder
                    </DialogTitle>
                    <DialogDescription>
                        Cadastre uma parte interessada vinculada a uma organização.
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
                        <Label htmlFor="stk-nome">Nome *</Label>
                        <Input
                            id="stk-nome"
                            placeholder="Ex.: SEMAD Goiás, Associação de Moradores"
                            value={form.nome}
                            onChange={(e) => onFormChange({ ...form, nome: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Categoria</Label>
                            <Select value={form.categoria} onValueChange={(v) => onFormChange({ ...form, categoria: v ?? '' })}>
                                <SelectTrigger className="h-9 w-full text-sm">
                                    <SelectValue placeholder="Selecione a categoria…">
                                        {CATEGORIA_BADGE[form.categoria]?.label ?? 'Selecione a categoria…'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIAS.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {CATEGORIA_BADGE[c].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="stk-contato">Contato</Label>
                            <Input
                                id="stk-contato"
                                placeholder="E-mail ou telefone"
                                value={form.contato}
                                onChange={(e) => onFormChange({ ...form, contato: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onAbertoChange(false)} type="button">
                        Cancelar
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={salvando || !orgId || !form.nome}
                        className="pressable gap-2"
                    >
                        {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
                        Cadastrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
