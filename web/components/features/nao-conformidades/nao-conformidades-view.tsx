'use client';

import { useMemo, useState } from 'react';
import { usePermissoes } from '@/lib/permissoes';
import type { NaoConformidade } from '@/lib/types';
import { useOrganizacoes } from '@/hooks/use-organizacoes';
import { useNaoConformidades } from './hooks/use-nao-conformidades';
import { NcHeader } from './nc-header';
import { NcMetricas } from './nc-metricas';
import { NcToolbar } from './nc-toolbar';
import { NcTable } from './nc-table';
import { NcModal } from './nc-modal';
import { AcoesModal } from './acoes-modal';

/** Orquestra seções. Estado compartilhado (org/filtros/modos) desce via props. */
export function NaoConformidadesView() {
    const { podeEscrever } = usePermissoes();
    const [orgId, setOrgId] = useState<string>('');
    const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
    const [filtroGravidade, setFiltroGravidade] = useState<string>('TODAS');
    const [modalAberto, setModalAberto] = useState(false);
    const [acoesNc, setAcoesNc] = useState<NaoConformidade | null>(null);

    const { data: organizacoes } = useOrganizacoes();
    const { data: ncs, isPending } = useNaoConformidades(orgId ? Number(orgId) : undefined);

    const filtradas = useMemo(() => {
        if (!ncs) return [];
        return ncs.filter((n) => {
            const matchStatus = filtroStatus === 'TODOS' || n.status === filtroStatus;
            const matchGravidade = filtroGravidade === 'TODAS' || n.gravidade === filtroGravidade;
            return matchStatus && matchGravidade;
        });
    }, [ncs, filtroStatus, filtroGravidade]);

    return (
        <div className="space-y-6">
            <NcHeader podeEscrever={podeEscrever} onRegistrar={() => setModalAberto(true)} />
            <NcMetricas ncs={ncs} isPending={isPending} />
            <NcToolbar
                orgId={orgId}
                onOrgChange={setOrgId}
                filtroStatus={filtroStatus}
                onStatusChange={setFiltroStatus}
                filtroGravidade={filtroGravidade}
                onGravidadeChange={setFiltroGravidade}
                organizacoes={organizacoes}
            />
            <NcTable filtradas={filtradas} isPending={isPending} onAcoes={setAcoesNc} />
            <NcModal
                aberto={modalAberto}
                onAbertoChange={setModalAberto}
                orgId={orgId}
                onOrgChange={setOrgId}
                organizacoes={organizacoes}
            />
            <AcoesModal nc={acoesNc} onClose={() => setAcoesNc(null)} />
        </div>
    );
}
