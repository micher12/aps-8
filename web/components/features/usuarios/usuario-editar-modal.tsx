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
import type { UsuarioGestao } from './tipos';

interface UsuarioEditarModalProps {
    editando: UsuarioGestao | null;
    onFechar: () => void;
    novoNome: string;
    onNovoNomeChange: (value: string) => void;
    novoPerfil: string;
    onNovoPerfilChange: (value: string) => void;
    onSalvar: () => void;
    salvando: boolean;
}

export function UsuarioEditarModal({
    editando,
    onFechar,
    novoNome,
    onNovoNomeChange,
    novoPerfil,
    onNovoPerfilChange,
    onSalvar,
    salvando,
}: UsuarioEditarModalProps) {
    return (
        <Dialog open={editando !== null} onOpenChange={(aberto) => { if (!aberto) onFechar(); }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        Editar {editando?.nome}
                    </DialogTitle>
                    <DialogDescription>
                        Altere o nome de exibição e o perfil de acesso da conta.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="eu-nome">Nome *</Label>
                        <Input
                            id="eu-nome"
                            value={novoNome}
                            onChange={(e) => onNovoNomeChange(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Perfil de Acesso</Label>
                        <Select value={novoPerfil} onValueChange={(v) => onNovoPerfilChange(v ?? '')}>
                            <SelectTrigger className="h-9 w-full text-sm">
                                <SelectValue placeholder="Selecione o perfil…">
                                    {PERFIL_BADGES[novoPerfil]?.label ?? 'Selecione o perfil…'}
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
                <DialogFooter>
                    <Button variant="ghost" onClick={onFechar} type="button">
                        Cancelar
                    </Button>
                    <Button
                        onClick={onSalvar}
                        disabled={salvando || !novoNome}
                        className="pressable gap-2"
                    >
                        {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
                        Salvar Alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
