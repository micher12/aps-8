'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrganizacoes } from '@/hooks/use-organizacoes';
import { AlertaLicencas } from './alerta-licencas';
import { DashboardError } from './dashboard-error';
import { DashboardHeader } from './dashboard-header';
import { DashboardSkeleton } from './dashboard-skeleton';
import { EvolucaoSection } from './evolucao-section';
import { useDashboardResumo } from './hooks/use-dashboard';
import { KpiGrid } from './kpi-grid';

export function DashboardView() {
    const [orgId, setOrgId] = useState<string>('');
    const orgIdNum = orgId ? Number(orgId) : undefined;
    const { data, isPending, isError } = useDashboardResumo(orgIdNum);
    const { data: organizacoes } = useOrganizacoes();

    if (isPending) return <DashboardSkeleton />;
    if (isError || !data) return <DashboardError />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <DashboardHeader />
                <div className="flex items-center gap-2 w-full sm:w-72 shrink-0">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Select value={orgId} onValueChange={(v) => setOrgId(v ?? '')}>
                        <SelectTrigger className="h-9 w-full text-xs">
                            <SelectValue placeholder="Todas as Organizações (Consolidado)">
                                {organizacoes?.find((o) => String(o.id) === orgId)?.razaoSocial ??
                                    'Todas as Organizações (Consolidado)'}
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
            </div>
            <AlertaLicencas />
            <KpiGrid resumo={data} />
            <EvolucaoSection historico={data.historicoMensal} organizacaoId={orgIdNum} />
        </div>
    );
}
