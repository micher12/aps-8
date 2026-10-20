'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { usePermissoes } from '@/lib/permissoes';
import type { Stakeholder } from '@/lib/types';
import { useOrganizacoes } from '@/hooks/use-organizacoes';
import { useStakeholders } from './hooks/use-stakeholders';
import { StakeholdersHeader } from './stakeholders-header';
import { StakeholdersMetricas } from './stakeholders-metricas';
import { StakeholdersToolbar } from './stakeholders-toolbar';
import { StakeholdersTable } from './stakeholders-table';
import { StakeholderModal, type StakeholderForm } from './stakeholder-modal';

const FORM_INICIAL: StakeholderForm = { nome: '', categoria: 'COMUNIDADE', contato: '' };

/** Orquestra estado local + dados. Seções detêm próprio JSX (SRP). */
export function StakeholdersView() {
    const qc = useQueryClient();
    const { podeEscrever } = usePermissoes();
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('TODAS');
    const [modalAberto, setModalAberto] = useState(false);
    const [orgId, setOrgId] = useState('');
    const [form, setForm] = useState<StakeholderForm>(FORM_INICIAL);

    const { data: stakeholders, isPending } = useStakeholders();
    const { data: organizacoes } = useOrganizacoes(podeEscrever);

    const criar = useMutation({
        mutationFn: () =>
            api
                .post<Stakeholder>('/stakeholders', {
                    organizacaoId: Number(orgId),
                    nome: form.nome,
                    categoria: form.categoria,
                    contato: form.contato || null,
                })
                .then((r) => r.dados),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['stakeholders'] });
            toast.success('Stakeholder cadastrado com sucesso');
            setForm({ nome: '', categoria: 'COMUNIDADE', contato: '' });
            setModalAberto(false);
        },
        onError: (e: Error) => toast.error(`Erro ao cadastrar: ${e.message}`),
    });

    const excluir = useMutation({
        mutationFn: (id: number) => api.delete(`/stakeholders/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['stakeholders'] });
            toast.success('Stakeholder removido');
        },
        onError: (e: Error) => toast.error(`Erro ao remover: ${e.message}`),
    });

    const filtrados = useMemo(() => {
        if (!stakeholders) return [];
        return stakeholders.filter((s) => {
            const busca = termoBusca.toLowerCase();
            const matchBusca =
                s.nome.toLowerCase().includes(busca) ||
                (s.contato && s.contato.toLowerCase().includes(busca)) ||
                s.categoria.toLowerCase().includes(busca);

            const matchCategoria = filtroCategoria === 'TODAS' || s.categoria === filtroCategoria;
            return matchBusca && matchCategoria;
        });
    }, [stakeholders, termoBusca, filtroCategoria]);

    const metricas = useMemo(() => {
        if (!stakeholders) return { total: 0, orgaos: 0, comunidade: 0, fornecedores: 0 };
        const orgaos = stakeholders.filter((s) => s.categoria === 'ORGAO_PUBLICO').length;
        const comunidade = stakeholders.filter((s) => s.categoria === 'COMUNIDADE').length;
        const fornecedores = stakeholders.filter((s) => s.categoria === 'FORNECEDOR').length;
        return { total: stakeholders.length, orgaos, comunidade, fornecedores };
    }, [stakeholders]);

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <StakeholdersHeader podeEscrever={podeEscrever} onNovo={() => setModalAberto(true)} />

            {/* Faixa de KPIs */}
            <StakeholdersMetricas metricas={metricas} isPending={isPending} />

            {/* Toolbar com Filtros */}
            <StakeholdersToolbar
                termoBusca={termoBusca}
                onTermoBuscaChange={setTermoBusca}
                filtroCategoria={filtroCategoria}
                onFiltroCategoriaChange={setFiltroCategoria}
            />

            {/* Tabela de Stakeholders */}
            <StakeholdersTable
                stakeholders={filtrados}
                isPending={isPending}
                podeEscrever={podeEscrever}
                onExcluir={(id) => excluir.mutate(id)}
                excluindo={excluir.isPending}
            />

            {/* Modal de Cadastro */}
            <StakeholderModal
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
