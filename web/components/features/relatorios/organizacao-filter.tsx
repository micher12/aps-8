'use client';

import { Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrganizacoes } from '@/hooks/use-organizacoes';

interface OrganizacaoFilterProps {
    orgId: string;
    onChange: (orgId: string) => void;
}

export function OrganizacaoFilter({ orgId, onChange }: OrganizacaoFilterProps) {
    const { data: organizacoes } = useOrganizacoes();

    return (
        <Card className="border-border/80 bg-card/60 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-primary" />
                        Filtrar por Organização Específica
                    </Label>
                    <p className="text-xs text-muted-foreground">
                        Deixe selecionado &quot;Todas as Organizações&quot; para um relatório consolidado estadual.
                    </p>
                </div>

                <Select value={orgId} onValueChange={(v) => onChange(v ?? '')}>
                    <SelectTrigger className="h-10 w-full text-sm sm:w-72">
                        <SelectValue placeholder="Todas as Organizações (Consolidado)">
                            {organizacoes?.find((o) => String(o.id) === orgId)?.razaoSocial ?? 'Todas as Organizações (Consolidado)'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todas as Organizações (Consolidado)</SelectItem>
                        {organizacoes?.map((o) => (
                            <SelectItem key={o.id} value={String(o.id)}>
                                {o.razaoSocial}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </Card>
    );
}
