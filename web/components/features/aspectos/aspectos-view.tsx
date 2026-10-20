'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { usePermissoes } from '@/lib/permissoes';
import type { Aspecto } from '@/lib/types';
import { useOrganizacoes } from '@/hooks/use-organizacoes';
import { useAspectos } from './hooks/use-aspectos';
import { AspectosHeader } from './aspectos-header';
import { AspectosKpis } from './aspectos-kpis';
import { AspectosToolbar } from './aspectos-toolbar';
import { AspectosTable } from './aspectos-table';
import { AspectoModal, type AspectoForm } from './aspecto-modal';

const FORM_INICIAL: AspectoForm = {
    descricao: '',
    tipo: 'RESIDUO',
    impacto: '',
    frequencia: '3',
    gravidade: '3',
    probabilidade: '3',
};

/** Orquestra estado local + dados. Seções detêm próprio JSX (SRP). */
export function AspectosView() {
    const qc = useQueryClient();
    const { podeEscrever } = usePermissoes();
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroNivel, setFiltroNivel] = useState('TODOS');
    const [modalAberto, setModalAberto] = useState(false);
    const [orgId, setOrgId] = useState('');
    const [form, setForm] = useState<AspectoForm>(FORM_INICIAL);

    const { data: aspectos, isPending } = useAspectos();
    const { data: organizacoes } = useOrganizacoes(podeEscrever);

    const criar = useMutation({
        mutationFn: () =>
            api
                .post<Aspecto>('/aspectos', {
                    organizacaoId: Number(orgId),
                    descricao: form.descricao,
                    tipo: form.tipo,
                    impacto: form.impacto,
                    frequencia: Number(form.frequencia),
                    gravidade: Number(form.gravidade),
                    probabilidade: Number(form.probabilidade),
                })
                .then((r) => r.dados),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['aspectos'] });
            toast.success('Aspecto ambiental registrado');
            setForm({ descricao: '', tipo: 'RESIDUO', impacto: '', frequencia: '3', gravidade: '3', probabilidade: '3' });
            setModalAberto(false);
        },
        onError: (e: Error) => toast.error(`Erro ao registrar: ${e.message}`),
    });

    const excluir = useMutation({
        mutationFn: (id: number) => api.delete(`/aspectos/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['aspectos'] });
            toast.success('Aspecto removido');
        },
        onError: (e: Error) => toast.error(`Erro ao remover: ${e.message}`),
    });

    const filtrados = useMemo(() => {
        if (!aspectos) return [];
        return aspectos.filter((a) => {
            const busca = termoBusca.toLowerCase();
            const matchBusca =
                a.descricao.toLowerCase().includes(busca) ||
                a.impacto.toLowerCase().includes(busca) ||
                a.tipo.toLowerCase().includes(busca);

            const nivel =
                a.grauSignificancia >= 60
                    ? 'CRITICO'
                    : a.grauSignificancia >= 36
                      ? 'MODERADO'
                      : 'BAIXO';

            const matchNivel = filtroNivel === 'TODOS' || nivel === filtroNivel;
            return matchBusca && matchNivel;
        });
    }, [aspectos, termoBusca, filtroNivel]);

    const metricas = useMemo(() => {
        if (!aspectos) return { total: 0, criticos: 0, moderados: 0, baixos: 0 };
        const criticos = aspectos.filter((a) => a.grauSignificancia >= 60).length;
        const moderados = aspectos.filter((a) => a.grauSignificancia >= 36 && a.grauSignificancia < 60).length;
        const baixos = aspectos.filter((a) => a.grauSignificancia < 36).length;
        return { total: aspectos.length, criticos, moderados, baixos };
    }, [aspectos]);

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <AspectosHeader podeEscrever={podeEscrever} onNovo={() => setModalAberto(true)} />

            {/* Faixa de KPIs */}
            <AspectosKpis metricas={metricas} isPending={isPending} />

            {/* Toolbar com Filtros */}
            <AspectosToolbar
                termoBusca={termoBusca}
                onTermoBuscaChange={setTermoBusca}
                filtroNivel={filtroNivel}
                onFiltroNivelChange={setFiltroNivel}
            />

            {/* Tabela de Aspectos e Impactos */}
            <AspectosTable
                aspectos={filtrados}
                isPending={isPending}
                podeEscrever={podeEscrever}
                onExcluir={(id) => excluir.mutate(id)}
                excluindo={excluir.isPending}
            />

            {/* Modal de Registro */}
            <AspectoModal
                aberto={modalAberto}
                onAbertoChange={setModalAberto}
                orgId={orgId}
                onOrgIdChange={setOrgId}
                form={form}
                onFormChange={setForm}
                organizacoes={organizacoes}
                onSubmit={() => criar.mutate()}
                salvando={criar.isPending}
            />
        </div>
    );
}
