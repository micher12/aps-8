'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';
import { fetchCnpjBrasilApi } from '@/lib/organizacoes-api';
import { queryKeys } from '@/lib/queryKeys';
import type { Organizacao } from '@/lib/types';
import { useMunicipios } from '@/hooks/use-municipios';
import { useOrganizacoes } from '@/hooks/use-organizacoes';
import { OrganizacaoModal, FORM_VAZIO } from './organizacao-modal';
import { OrganizacoesHeader } from './organizacoes-header';
import { OrganizacoesMetricas } from './organizacoes-metricas';
import { OrganizacoesTable } from './organizacoes-table';
import { OrganizacoesToolbar } from './organizacoes-toolbar';

/**
 * Orquestra seções de organizações.
 *
 * Decisão de estado: a view detém todo estado compartilhado (form, editando,
 * modalAberto, abrindoCnpj, termoBusca, filtroPorte) + mutations
 * (salvar/remover) + preencherPorCnpj, e desce via props. Toolbar/table/modal
 * são presentacionais; só a view conhece hooks compartilhados
 * (useOrganizacoes/useMunicipios) e a camada api — nenhuma seção conhece
 * endpoint diretamente.
 */
export function OrganizacoesView() {
    const qc = useQueryClient();
    const [form, setForm] = useState(FORM_VAZIO);
    const [editando, setEditando] = useState<number | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [abrindoCnpj, setAbrindoCnpj] = useState(false);
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroPorte, setFiltroPorte] = useState('TODOS');

    const { data: organizacoes, isPending } = useOrganizacoes();
    const { data: municipios } = useMunicipios();

    const salvar = useMutation({
        mutationFn: () => {
            const body = {
                razaoSocial: form.razaoSocial,
                cnpj: form.cnpj.replace(/\D/g, '') || null,
                setor: form.setor || null,
                porte: form.porte || null,
                municipioId: form.municipioId ? Number(form.municipioId) : null,
                logradouro: form.logradouro || null,
                cep: form.cep.replace(/\D/g, '') || null,
                latitude: form.latitude ? Number(form.latitude) : null,
                longitude: form.longitude ? Number(form.longitude) : null,
            };
            return editando
                ? api.put<Organizacao>(`/organizacoes/${editando}`, body)
                : api.post<Organizacao>('/organizacoes', body);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.organizacoes });
            toast.success(editando ? 'Organização atualizada com sucesso' : 'Organização cadastrada com sucesso');
            fecharModal();
        },
        onError: (e: Error) => {
            const msg = e instanceof ApiError && e.detalhes
                ? Object.values(e.detalhes).join(' · ')
                : e.message;
            toast.error(msg);
        },
    });

    const remover = useMutation({
        mutationFn: (id: number) => api.delete(`/organizacoes/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.organizacoes });
            toast.success('Organização desativada');
        },
        onError: (e: Error) => toast.error(`Erro ao remover: ${e.message}`),
    });

    function abrirNovo() {
        setEditando(null);
        setForm(FORM_VAZIO);
        setModalAberto(true);
    }

    function abrirEdicao(o: Organizacao) {
        setEditando(o.id);
        setForm({
            razaoSocial: o.razaoSocial,
            cnpj: o.cnpj ?? '',
            setor: o.setor ?? '',
            porte: o.porte ?? '',
            municipioId: o.municipioId?.toString() ?? '',
            logradouro: o.logradouro ?? '',
            cep: o.cep ?? '',
            latitude: o.latitude?.toString() ?? '',
            longitude: o.longitude?.toString() ?? '',
        });
        setModalAberto(true);
    }

    function fecharModal() {
        setModalAberto(false);
        setEditando(null);
        setForm(FORM_VAZIO);
    }

    async function preencherPorCnpj() {
        const limpo = form.cnpj.replace(/\D/g, '');
        if (limpo.length !== 14) {
            toast.error('Digite um CNPJ válido com 14 dígitos para buscar na BrasilAPI');
            return;
        }
        setAbrindoCnpj(true);
        try {
            const d = await fetchCnpjBrasilApi(limpo);
            setForm((f) => ({
                ...f,
                razaoSocial: d.razao_social || f.razaoSocial,
                logradouro: d.logradouro ?? f.logradouro,
                cep: (d.cep ?? '').replace(/\D/g, '') || f.cep,
                municipioId: d.codigo_municipio_ibge
                    ? String(d.codigo_municipio_ibge)
                    : f.municipioId,
            }));
            toast.success('Dados preenchidos via BrasilAPI');
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Falha ao consultar CNPJ';
            toast.error(msg);
        } finally {
            setAbrindoCnpj(false);
        }
    }

    const filtradas = useMemo(() => {
        if (!organizacoes) return [];
        const termo = termoBusca.trim().toLowerCase();
        const digitos = termoBusca.replace(/\D/g, '');
        return organizacoes.filter((o) => {
            const matchBusca =
                termo === '' ||
                o.razaoSocial.toLowerCase().includes(termo) ||
                (digitos.length >= 3 && o.cnpj != null && o.cnpj.includes(digitos)) ||
                (o.municipioNome != null && o.municipioNome.toLowerCase().includes(termo)) ||
                (o.setor != null && o.setor.toLowerCase().includes(termo));

            const matchPorte = filtroPorte === 'TODOS' || o.porte === filtroPorte;
            return matchBusca && matchPorte;
        });
    }, [organizacoes, termoBusca, filtroPorte]);

    return (
        <div className="space-y-6">
            <OrganizacoesHeader onNovo={abrirNovo} />
            <OrganizacoesMetricas organizacoes={organizacoes} />
            <OrganizacoesToolbar
                termoBusca={termoBusca}
                onTermoBuscaChange={setTermoBusca}
                filtroPorte={filtroPorte}
                onFiltroPorteChange={setFiltroPorte}
            />
            <OrganizacoesTable
                organizacoes={filtradas}
                isPending={isPending}
                termoBusca={termoBusca}
                onEditar={abrirEdicao}
                onRemover={(id) => remover.mutate(id)}
            />
            <OrganizacaoModal
                modalAberto={modalAberto}
                onAbertoChange={setModalAberto}
                editando={editando}
                form={form}
                setForm={setForm}
                municipios={municipios}
                abrindoCnpj={abrindoCnpj}
                onBuscarCnpj={preencherPorCnpj}
                onFechar={fecharModal}
                onSalvar={() => salvar.mutate()}
                salvando={salvar.isPending}
            />
        </div>
    );
}
