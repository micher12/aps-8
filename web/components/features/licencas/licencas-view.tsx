'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { usePermissoes } from '@/lib/permissoes';
import { useOrganizacoes } from '@/hooks/use-organizacoes';
import type { Licenca } from '@/lib/types';
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
import { VAZIO } from './licenca-modal';
import { useLicencas } from './hooks/use-licencas';
import { LicencasHeader } from './licencas-header';
import { LicencasKpis } from './licencas-kpis';
import { LicencasToolbar } from './licencas-toolbar';
import { LicencasTable } from './licencas-table';
import { LicencaModal } from './licenca-modal';

/** Orquestra estado + dados. Cada seção detém próprio recorte de UI (SRP). */
export function LicencasView() {
    const qc = useQueryClient();
    const { podeEscrever, isAdmin } = usePermissoes();
    const [apenasVencendo, setApenasVencendo] = useState(false);
    const [dias, setDias] = useState(30);
    const [termoBusca, setTermoBusca] = useState('');
    const [orgId, setOrgId] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState<Licenca | null>(null);
    const [form, setForm] = useState(VAZIO);
    const [licencaPendente, setLicencaPendente] = useState<Licenca | null>(null);

    const { data: licencas, isPending } = useLicencas(apenasVencendo, dias);

    const { data: organizacoes } = useOrganizacoes(podeEscrever);

    const invalidar = () => qc.invalidateQueries({ queryKey: ['licencas'] });

    const salvar = useMutation({
        mutationFn: () => {
            const body = {
                organizacaoId: Number(orgId),
                numero: form.numero,
                tipo: form.tipo,
                orgaoEmissor: form.orgaoEmissor || undefined,
                dataEmissao: form.dataEmissao,
                dataValidade: form.dataValidade,
                observacao: form.observacao || undefined,
            };
            return (editando
                ? api.put<Licenca>(`/licencas/${editando.id}`, body)
                : api.post<Licenca>('/licencas', body)
            ).then((r) => r.dados);
        },
        onSuccess: () => {
            invalidar();
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success(editando ? 'Licença atualizada' : 'Licença registrada');
            setForm(VAZIO);
            setEditando(null);
            setModalAberto(false);
        },
        onError: (e: Error) => toast.error(`Erro ao salvar: ${e.message}`),
    });

    const excluir = useMutation({
        mutationFn: (id: number) => api.delete(`/licencas/${id}`),
        onSuccess: () => {
            invalidar();
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Licença removida');
        },
        onError: (e: Error) => toast.error(`Erro ao remover: ${e.message}`),
    });

    const abrirCriar = () => {
        setEditando(null);
        setForm(VAZIO);
        setModalAberto(true);
    };

    const abrirEditar = (l: Licenca) => {
        setEditando(l);
        setOrgId(String(l.organizacaoId));
        setForm({
            numero: l.numero,
            tipo: l.tipo,
            orgaoEmissor: l.orgaoEmissor ?? '',
            dataEmissao: l.dataEmissao,
            dataValidade: l.dataValidade,
            observacao: l.observacao ?? '',
        });
        setModalAberto(true);
    };

    const excluirLicenca = (l: Licenca) => {
        setLicencaPendente(l);
    };

    const filtradas = useMemo(() => {
        if (!licencas) return [];
        return licencas.filter((l) => {
            const busca = termoBusca.toLowerCase();
            return (
                l.numero.toLowerCase().includes(busca) ||
                l.tipo.toLowerCase().includes(busca) ||
                (l.orgaoEmissor ?? '').toLowerCase().includes(busca)
            );
        });
    }, [licencas, termoBusca]);

    return (
        <div className="space-y-6">
            <LicencasHeader podeEscrever={podeEscrever} onCriar={abrirCriar} />

            <LicencasKpis licencas={licencas} isPending={isPending} />

            <LicencasToolbar
                termoBusca={termoBusca}
                onTermoBuscaChange={setTermoBusca}
                apenasVencendo={apenasVencendo}
                onToggleVencendo={() => setApenasVencendo(!apenasVencendo)}
                dias={dias}
                onDiasChange={setDias}
            />

            <LicencasTable
                licencas={filtradas}
                isPending={isPending}
                podeEscrever={podeEscrever}
                isAdmin={isAdmin}
                termoBusca={termoBusca}
                onEditar={abrirEditar}
                onExcluir={excluirLicenca}
                excluirPending={excluir.isPending}
            />

            <LicencaModal
                aberto={modalAberto}
                onAbertoChange={setModalAberto}
                form={form}
                onFormChange={setForm}
                orgId={orgId}
                onOrgIdChange={setOrgId}
                organizacoes={organizacoes}
                editando={editando}
                onSalvar={() => salvar.mutate()}
                salvando={salvar.isPending}
            />

            <AlertDialog open={licencaPendente !== null} onOpenChange={(aberto) => { if (!aberto) setLicencaPendente(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover licença?</AlertDialogTitle>
                        <AlertDialogDescription>
                            A licença &quot;{licencaPendente?.numero}&quot; será removida permanentemente. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={excluir.isPending}
                            onClick={() => {
                                if (licencaPendente) excluir.mutate(licencaPendente.id);
                                setLicencaPendente(null);
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
