'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { usePermissoes } from '@/lib/permissoes';
import { useOrganizacoes } from '@/hooks/use-organizacoes';
import type { Residuo } from '@/lib/types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { VAZIO } from './residuos-constantes';
import { useResiduos } from './hooks/use-residuos';
import { ResiduosHeader } from './residuos-header';
import { ResiduosKpis } from './residuos-kpis';
import { ResiduosToolbar } from './residuos-toolbar';
import { ResiduosTable } from './residuos-table';
import { ResiduoModal } from './residuo-modal';

/** Orquestra estado + dados. Cada seção detém próprio recorte de UI (SRP). */
export function ResiduosView() {
    const qc = useQueryClient();
    const { podeEscrever } = usePermissoes();
    const [orgId, setOrgId] = useState<string>('');
    const [filtroClasse, setFiltroClasse] = useState<string>('TODAS');
    const [termoBusca, setTermoBusca] = useState('');
    const [form, setForm] = useState(VAZIO);
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState<Residuo | null>(null);
    // Organização do formulário separada da do filtro: abrir o modal não muda a listagem
    const [orgIdModal, setOrgIdModal] = useState<string>('');
    const [residuoPendente, setResiduoPendente] = useState<Residuo | null>(null);

    const { data: organizacoes } = useOrganizacoes();

    const { data: residuos, isPending } = useResiduos(orgId ? Number(orgId) : undefined);

    const salvar = useMutation({
        mutationFn: () => {
            const body = {
                organizacaoId: Number(orgIdModal),
                tipo: form.tipo,
                classe: form.classe,
                quantidade: Number(form.quantidade),
                unidade: form.unidade,
                destinacao: form.destinacao,
                destinatario: form.destinatario || null,
            };
            return (editando
                ? api.put<Residuo>(`/residuos/${editando.id}`, body)
                : api.post<Residuo>('/residuos', body)
            ).then((r) => r.dados);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['residuos'] });
            toast.success(editando ? 'Resíduo atualizado' : 'Resíduo registrado no inventário');
            setForm(VAZIO);
            setEditando(null);
            setModalAberto(false);
        },
        onError: (e: Error) => toast.error(`Erro ao salvar: ${e.message}`),
    });

    const excluir = useMutation({
        mutationFn: (id: number) => api.delete(`/residuos/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['residuos'] });
            toast.success('Resíduo removido do inventário');
        },
        onError: (e: Error) => toast.error(`Erro ao remover: ${e.message}`),
    });

    const abrirCriar = () => {
        setEditando(null);
        setForm(VAZIO);
        setOrgIdModal('');
        setModalAberto(true);
    };

    const abrirEditar = (r: Residuo) => {
        setEditando(r);
        setOrgIdModal(String(r.organizacaoId));
        setForm({
            tipo: r.tipo,
            classe: r.classe,
            quantidade: String(r.quantidade),
            unidade: r.unidade,
            destinacao: r.destinacao,
            destinatario: r.destinatario ?? '',
        });
        setModalAberto(true);
    };

    const excluirResiduo = (r: Residuo) => {
        setResiduoPendente(r);
    };

    const filtrados = useMemo(() => {
        if (!residuos) return [];
        return residuos.filter((r) => {
            const busca = termoBusca.toLowerCase();
            const matchBusca =
                r.tipo.toLowerCase().includes(busca) ||
                r.destinacao.toLowerCase().includes(busca) ||
                (r.destinatario && r.destinatario.toLowerCase().includes(busca));

            const matchClasse = filtroClasse === 'TODAS' || r.classe === filtroClasse;
            return matchBusca && matchClasse;
        });
    }, [residuos, termoBusca, filtroClasse]);

    return (
        <div className="space-y-6">
            <ResiduosHeader podeEscrever={podeEscrever} onCriar={abrirCriar} />

            <ResiduosKpis residuos={residuos} isPending={isPending} />

            <ResiduosToolbar
                termoBusca={termoBusca}
                onTermoBuscaChange={setTermoBusca}
                orgId={orgId}
                onOrgIdChange={setOrgId}
                organizacoes={organizacoes}
                filtroClasse={filtroClasse}
                onFiltroClasseChange={setFiltroClasse}
            />

            <ResiduosTable
                residuos={filtrados}
                isPending={isPending}
                podeEscrever={podeEscrever}
                termoBusca={termoBusca}
                onEditar={abrirEditar}
                onExcluir={excluirResiduo}
                excluirPending={excluir.isPending}
            />

            <ResiduoModal
                aberto={modalAberto}
                onAbertoChange={setModalAberto}
                form={form}
                onFormChange={setForm}
                orgId={orgIdModal}
                onOrgIdChange={setOrgIdModal}
                organizacoes={organizacoes}
                editando={editando}
                onSalvar={() => salvar.mutate()}
                salvando={salvar.isPending}
            />

            <AlertDialog open={residuoPendente !== null} onOpenChange={(aberto) => { if (!aberto) setResiduoPendente(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover resíduo?</AlertDialogTitle>
                        <AlertDialogDescription>
                            O resíduo &quot;{residuoPendente?.tipo}&quot; será removido do inventário permanentemente. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={excluir.isPending}
                            onClick={() => {
                                if (residuoPendente) excluir.mutate(residuoPendente.id);
                                setResiduoPendente(null);
                            }}
                        >
                            Remover
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
