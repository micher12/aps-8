'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { usePermissoes } from '@/lib/permissoes';
import type { Monitoramento, TipoMonitoramento } from '@/lib/types';
import { useOrganizacoes } from '@/hooks/use-organizacoes';
import { ROTULOS } from './rotulos';
import { useMonitoramentos } from './hooks/use-monitoramentos';
import { MonitoramentosHeader } from './monitoramentos-header';
import { MonitoramentosKpis } from './monitoramentos-kpis';
import { MonitoramentosToolbar } from './monitoramentos-toolbar';
import { MonitoramentosTable } from './monitoramentos-table';
import { MonitoramentoModal } from './monitoramento-modal';

/** Data local (o toISOString UTC devolvia o dia seguinte após as 21h no fuso do Brasil). */
function dataLocalHoje(): string {
    const agora = new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    return `${agora.getFullYear()}-${mes}-${dia}`;
}

/** Orquestra estado + dados. Blocos de UI vivem nos componentes filhos (SRP). */
export function MonitoramentosView() {
    const qc = useQueryClient();
    const { podeEscrever } = usePermissoes();
    const [orgId, setOrgId] = useState<string>('');
    const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState<Monitoramento | null>(null);
    // Organização do formulário separada da do filtro: abrir o modal não muda a listagem
    const [orgIdModal, setOrgIdModal] = useState<string>('');

    const [tipo, setTipo] = useState<TipoMonitoramento>('AGUA');
    const [valor, setValor] = useState('');
    const [data, setData] = useState('');
    const [observacao, setObservacao] = useState('');

    const { data: organizacoes } = useOrganizacoes();
    const { data: monitoramentos, isPending } = useMonitoramentos(orgId ? Number(orgId) : undefined);

    const salvar = useMutation({
        mutationFn: () => {
            const body = {
                organizacaoId: Number(orgIdModal),
                tipo,
                valor: Number(valor),
                unidade: ROTULOS[tipo].unidade,
                dataMedicao: data,
                observacao: observacao || undefined,
            };
            return (editando
                ? api.put<Monitoramento>(`/monitoramentos/${editando.id}`, body)
                : api.post<Monitoramento>('/monitoramentos', body)
            ).then((r) => r.dados);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['monitoramentos'] });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success(editando ? 'Medição atualizada' : 'Medição ambiental lançada com sucesso');
            setValor('');
            setObservacao('');
            setEditando(null);
            setModalAberto(false);
        },
        onError: (e: Error) => toast.error(`Erro ao salvar medição: ${e.message}`),
    });

    const excluir = useMutation({
        mutationFn: (id: number) => api.delete(`/monitoramentos/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['monitoramentos'] });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Medição removida');
        },
        onError: (e: Error) => toast.error(`Erro ao remover: ${e.message}`),
    });

    const abrirCriar = () => {
        setEditando(null);
        setOrgIdModal('');
        if (!data) setData(dataLocalHoje());
        setModalAberto(true);
    };

    const abrirEditar = (m: Monitoramento) => {
        setEditando(m);
        setOrgIdModal(String(m.organizacaoId));
        setTipo(m.tipo);
        setValor(String(m.valor));
        setData(m.dataMedicao);
        setObservacao(m.observacao ?? '');
        setModalAberto(true);
    };

    const filtrados = useMemo(() => {
        if (!monitoramentos) return [];
        return monitoramentos
            .slice()
            .reverse()
            .filter((m) => filtroTipo === 'TODOS' || m.tipo === filtroTipo);
    }, [monitoramentos, filtroTipo]);

    // Totais acumulados
    const totais = useMemo(() => {
        if (!monitoramentos) return { agua: 0, energia: 0, co2: 0 };
        return monitoramentos.reduce(
            (acc, m) => {
                if (m.tipo === 'AGUA') acc.agua += m.valor;
                else if (m.tipo === 'ENERGIA') acc.energia += m.valor;
                else if (m.tipo === 'CO2') acc.co2 += m.valor;
                return acc;
            },
            { agua: 0, energia: 0, co2: 0 },
        );
    }, [monitoramentos]);

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <MonitoramentosHeader podeEscrever={podeEscrever} onCriar={abrirCriar} />

            {/* Faixa de KPIs */}
            <MonitoramentosKpis totais={totais} isPending={isPending} />

            {/* Toolbar com Filtros */}
            <MonitoramentosToolbar
                orgId={orgId}
                onOrgIdChange={setOrgId}
                organizacoes={organizacoes}
                filtroTipo={filtroTipo}
                onFiltroTipoChange={setFiltroTipo}
            />

            {/* Tabela de Medições */}
            <MonitoramentosTable
                dados={filtrados}
                isPending={isPending}
                podeEscrever={podeEscrever}
                onEditar={abrirEditar}
                onExcluir={(id) => excluir.mutate(id)}
                excluindo={excluir.isPending}
            />

            {/* Modal de Lançamento */}
            <MonitoramentoModal
                aberto={modalAberto}
                onAbertoChange={setModalAberto}
                editando={editando}
                orgId={orgIdModal}
                onOrgIdChange={setOrgIdModal}
                organizacoes={organizacoes}
                tipo={tipo}
                onTipoChange={setTipo}
                valor={valor}
                onValorChange={setValor}
                data={data}
                onDataChange={setData}
                observacao={observacao}
                onObservacaoChange={setObservacao}
                onSalvar={() => salvar.mutate()}
                salvando={salvar.isPending}
            />
        </div>
    );
}
