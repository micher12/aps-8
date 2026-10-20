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
import type { Monitoramento, Organizacao, TipoMonitoramento } from '@/lib/types';
import { ROTULOS, OPCOES_INDICADOR } from './rotulos';

interface MonitoramentoModalProps {
    aberto: boolean;
    onAbertoChange: (aberto: boolean) => void;
    editando: Monitoramento | null;
    orgId: string;
    onOrgIdChange: (value: string) => void;
    organizacoes: Organizacao[] | undefined;
    tipo: TipoMonitoramento;
    onTipoChange: (value: TipoMonitoramento) => void;
    valor: string;
    onValorChange: (value: string) => void;
    data: string;
    onDataChange: (value: string) => void;
    observacao: string;
    onObservacaoChange: (value: string) => void;
    onSalvar: () => void;
    salvando: boolean;
}

export function MonitoramentoModal({
    aberto,
    onAbertoChange,
    editando,
    orgId,
    onOrgIdChange,
    organizacoes,
    tipo,
    onTipoChange,
    valor,
    onValorChange,
    data,
    onDataChange,
    observacao,
    onObservacaoChange,
    onSalvar,
    salvando,
}: MonitoramentoModalProps) {
    return (
        <Dialog open={aberto} onOpenChange={onAbertoChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        {editando ? 'Editar Medição Ambiental' : 'Lançar Medição Ambiental'}
                    </DialogTitle>
                    <DialogDescription>
                        Registre consumos e emissões para atualizar o dashboard em tempo real.
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

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Indicador</Label>
                            <Select value={tipo} onValueChange={(v) => onTipoChange((v ?? tipo) as TipoMonitoramento)}>
                                <SelectTrigger className="h-9 w-full text-sm">
                                    <SelectValue placeholder="Selecione o indicador…">
                                        {OPCOES_INDICADOR.find((i) => i.value === tipo)?.label ?? 'Selecione o indicador…'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {OPCOES_INDICADOR.map((i) => (
                                        <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="valor">Valor Medido ({ROTULOS[tipo].unidade}) *</Label>
                            <Input
                                id="valor"
                                type="number"
                                min="0"
                                step="0.001"
                                placeholder="0.00"
                                value={valor}
                                onChange={(e) => onValorChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Data da Leitura *</Label>
                        <DatePicker value={data} onChange={onDataChange} />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="obs">Observação Técnica</Label>
                        <Input
                            id="obs"
                            placeholder="Ex.: Hidrômetro setor fabril 1, Leitura fechamento mensal"
                            value={observacao}
                            onChange={(e) => onObservacaoChange(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onAbertoChange(false)} type="button">
                        Cancelar
                    </Button>
                    <Button
                        onClick={onSalvar}
                        disabled={salvando || !orgId || !valor || !data}
                        className="pressable gap-2"
                    >
                        {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
                        {editando ? 'Salvar Alterações' : 'Lançar Medição'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
