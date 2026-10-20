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
import { TIPOS } from './aspectos-constantes';

export interface AspectoForm {
    descricao: string;
    tipo: string;
    impacto: string;
    frequencia: string;
    gravidade: string;
    probabilidade: string;
}

interface AspectoModalProps {
    aberto: boolean;
    onAbertoChange: (aberto: boolean) => void;
    orgId: string;
    onOrgIdChange: (orgId: string) => void;
    form: AspectoForm;
    onFormChange: (form: AspectoForm) => void;
    organizacoes: Organizacao[] | undefined;
    onSubmit: () => void;
    salvando: boolean;
}

export function AspectoModal({
    aberto,
    onAbertoChange,
    orgId,
    onOrgIdChange,
    form,
    onFormChange,
    organizacoes,
    onSubmit,
    salvando,
}: AspectoModalProps) {
    return (
        <Dialog open={aberto} onOpenChange={onAbertoChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        Novo Aspecto Ambiental
                    </DialogTitle>
                    <DialogDescription>
                        Avalie Frequência, Gravidade e Probabilidade (1 a 5) para compor a significância.
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
                        <Label htmlFor="asp-desc">Aspecto Ambiental (Causa) *</Label>
                        <Input
                            id="asp-desc"
                            placeholder="Ex.: Geração de efluente no processo de lavagem"
                            value={form.descricao}
                            onChange={(e) => onFormChange({ ...form, descricao: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Tipo de Atividade</Label>
                            <Select value={form.tipo} onValueChange={(v) => onFormChange({ ...form, tipo: v ?? '' })}>
                                <SelectTrigger className="h-9 w-full text-sm">
                                    <SelectValue placeholder="Selecione o tipo…">
                                        {TIPOS.includes(form.tipo) ? form.tipo.replace('_', ' ') : 'Selecione o tipo…'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {TIPOS.map((t) => (
                                        <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="asp-impacto">Impacto (Efeito) *</Label>
                            <Input
                                id="asp-impacto"
                                placeholder="Ex.: Contaminação do solo"
                                value={form.impacto}
                                onChange={(e) => onFormChange({ ...form, impacto: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {(['frequencia', 'gravidade', 'probabilidade'] as const).map((campo) => (
                            <div key={campo} className="space-y-1.5">
                                <Label htmlFor={`asp-${campo}`} className="capitalize">{campo}</Label>
                                <Input
                                    id={`asp-${campo}`}
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={form[campo]}
                                    onChange={(e) => onFormChange({ ...form, [campo]: e.target.value })}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onAbertoChange(false)} type="button">
                        Cancelar
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={salvando || !orgId || !form.descricao || !form.impacto}
                        className="pressable gap-2"
                    >
                        {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
                        Registrar Aspecto
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
