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
import { PERFIL_BADGES, PERFIS } from './perfil-helpers';

export interface NovoUsuario {
    nome: string;
    email: string;
    senha: string;
    perfil: string;
}

interface UsuarioCriarModalProps {
    aberto: boolean;
    onAbertoChange: (aberto: boolean) => void;
    novo: NovoUsuario;
    onNovoChange: (novo: NovoUsuario) => void;
    onCriar: () => void;
    criando: boolean;
}

export function UsuarioCriarModal({
    aberto,
    onAbertoChange,
    novo,
    onNovoChange,
    onCriar,
    criando,
}: UsuarioCriarModalProps) {
    return (
        <Dialog open={aberto} onOpenChange={onAbertoChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">Novo Usuário</DialogTitle>
                    <DialogDescription>
                        Crie uma conta institucional com o perfil de acesso adequado.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="nu-nome">Nome Completo *</Label>
                        <Input
                            id="nu-nome"
                            placeholder="Ex.: Maria Silva"
                            value={novo.nome}
                            onChange={(e) => onNovoChange({ ...novo, nome: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="nu-email">E-mail Institucional *</Label>
                        <Input
                            id="nu-email"
                            type="email"
                            placeholder="nome@organizacao.go.gov.br"
                            value={novo.email}
                            onChange={(e) => onNovoChange({ ...novo, email: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="nu-senha">Senha Inicial *</Label>
                            <Input
                                id="nu-senha"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={novo.senha}
                                onChange={(e) => onNovoChange({ ...novo, senha: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Perfil de Acesso</Label>
                            <Select value={novo.perfil} onValueChange={(v) => onNovoChange({ ...novo, perfil: v ?? '' })}>
                                <SelectTrigger className="h-9 w-full text-sm">
                                    <SelectValue placeholder="Selecione o perfil…">
                                        {PERFIL_BADGES[novo.perfil]?.label ?? 'Selecione o perfil…'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {PERFIS.map((p) => (
                                        <SelectItem key={p} value={p}>{PERFIL_BADGES[p].label}</SelectItem>
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
                        onClick={onCriar}
                        disabled={criando || !novo.nome || !novo.email || novo.senha.length < 6}
                        className="pressable gap-2"
                    >
                        {criando && <Loader2 className="h-4 w-4 animate-spin" />}
                        Criar Usuário
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
