'use client';

import type { Dispatch, SetStateAction } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Municipio } from '@/lib/types';

const OPCOES_PORTE = [
    { value: 'MEI', label: 'MEI — Microempreendedor Individual' },
    { value: 'ME', label: 'ME — Microempresa' },
    { value: 'EPP', label: 'EPP — Empresa de Pequeno Porte' },
    { value: 'MEDIO', label: 'Médio Porte' },
    { value: 'GRANDE', label: 'Grande Porte' },
];

export const FORM_VAZIO = {
    razaoSocial: '',
    cnpj: '',
    setor: '',
    porte: '',
    municipioId: '',
    logradouro: '',
    cep: '',
    latitude: '',
    longitude: '',
};

export type OrganizacaoForm = typeof FORM_VAZIO;

interface OrganizacaoModalProps {
    modalAberto: boolean;
    onAbertoChange: (aberto: boolean) => void;
    editando: number | null;
    form: OrganizacaoForm;
    setForm: Dispatch<SetStateAction<OrganizacaoForm>>;
    municipios?: Municipio[];
    abrindoCnpj: boolean;
    onBuscarCnpj: () => void;
    onFechar: () => void;
    onSalvar: () => void;
    salvando: boolean;
}

export function OrganizacaoModal({
    modalAberto,
    onAbertoChange,
    editando,
    form,
    setForm,
    municipios,
    abrindoCnpj,
    onBuscarCnpj,
    onFechar,
    onSalvar,
    salvando,
}: OrganizacaoModalProps) {
    return (
        <Dialog open={modalAberto} onOpenChange={onAbertoChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        {editando ? `Editar Organização #${editando}` : 'Cadastrar Nova Organização'}
                    </DialogTitle>
                    <DialogDescription>
                        Preencha os dados da organização ou consulte pelo CNPJ via BrasilAPI.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Linha CNPJ + BrasilAPI */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <div className="sm:col-span-2 space-y-1.5">
                            <Label htmlFor="cnpj">CNPJ (14 dígitos)</Label>
                            <Input
                                id="cnpj"
                                placeholder="00.000.000/0000-00"
                                value={form.cnpj}
                                onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBuscarCnpj}
                            disabled={abrindoCnpj}
                            className="pressable h-9 gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                        >
                            {abrindoCnpj ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Buscando…
                                </>
                            ) : (
                                <>
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Buscar BrasilAPI
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Razão Social e Setor */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="razaoSocial">Razão Social *</Label>
                            <Input
                                id="razaoSocial"
                                placeholder="Nome empresarial da organização"
                                value={form.razaoSocial}
                                onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="setor">Setor de Atuação</Label>
                            <Input
                                id="setor"
                                placeholder="Ex.: Agronegócio, Metalurgia, Químico"
                                value={form.setor}
                                onChange={(e) => setForm({ ...form, setor: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Porte e Município */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Porte da Empresa</Label>
                            <Select value={form.porte} onValueChange={(v) => setForm({ ...form, porte: v ?? '' })}>
                                <SelectTrigger className="h-9 w-full text-sm">
                                    <SelectValue placeholder="Selecione o porte…">
                                        {OPCOES_PORTE.find((p) => p.value === form.porte)?.label ?? 'Selecione o porte…'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {OPCOES_PORTE.map((p) => (
                                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Município de Goiás (IBGE)</Label>
                            <Select value={form.municipioId} onValueChange={(v) => setForm({ ...form, municipioId: v ?? '' })}>
                                <SelectTrigger className="h-9 w-full text-sm">
                                    <SelectValue placeholder="Selecione o município…">
                                        {municipios?.find((m) => String(m.codigoIbge) === form.municipioId)?.nome ?? 'Selecione o município…'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {municipios?.map((m) => (
                                        <SelectItem key={m.codigoIbge} value={String(m.codigoIbge)}>
                                            {m.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Logradouro e CEP */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1.5">
                            <Label htmlFor="logradouro">Logradouro / Endereço</Label>
                            <Input
                                id="logradouro"
                                placeholder="Rua, avenida, número, distrito industrial"
                                value={form.logradouro}
                                onChange={(e) => setForm({ ...form, logradouro: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="cep">CEP</Label>
                            <Input
                                id="cep"
                                placeholder="74000-000"
                                value={form.cep}
                                onChange={(e) => setForm({ ...form, cep: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Coordenadas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                placeholder="-16.6869"
                                value={form.latitude}
                                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                placeholder="-49.2648"
                                value={form.longitude}
                                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onFechar} type="button">
                        Cancelar
                    </Button>
                    <Button
                        onClick={onSalvar}
                        disabled={salvando || !form.razaoSocial}
                        className="pressable gap-2"
                    >
                        {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
                        {editando ? 'Salvar Alterações' : 'Cadastrar Organização'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
