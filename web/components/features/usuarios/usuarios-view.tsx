'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';
import { useUsuario } from '@/lib/auth';
import { useUsuarios } from './hooks/use-usuarios';
import { AcessoRestrito } from './acesso-restrito';
import { UsuariosHeader } from './usuarios-header';
import { UsuariosKpis } from './usuarios-kpis';
import { UsuariosToolbar } from './usuarios-toolbar';
import { UsuariosTable } from './usuarios-table';
import { UsuarioCriarModal } from './usuario-criar-modal';
import { UsuarioEditarModal } from './usuario-editar-modal';
import type { UsuarioGestao } from './tipos';

/** Orquestra estado + dados. Blocos de UI vivem nos componentes filhos (SRP). */
export function UsuariosView() {
    const qc = useQueryClient();
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroPerfil, setFiltroPerfil] = useState('TODOS');
    const [filtroStatus, setFiltroStatus] = useState('TODOS');
    const [modalCriar, setModalCriar] = useState(false);
    const [editando, setEditando] = useState<UsuarioGestao | null>(null);
    const [novoNome, setNovoNome] = useState('');
    const [novoPerfil, setNovoPerfil] = useState('CONSULTOR');
    const [novo, setNovo] = useState({ nome: '', email: '', senha: '', perfil: 'CONSULTOR' });

    const { data: usuarios, isPending, isError } = useUsuarios();
    const eu = useUsuario();

    const invalidar = () => qc.invalidateQueries({ queryKey: ['usuarios'] });

    // 403 no token (sessão sem ROLE_ADMIN — ex. cookie de sessão trocado):
    // orienta logout/login em vez do genérico "sem permissão".
    function erroMutacao(origem: string) {
        return (e: Error) => {
            if (e instanceof ApiError && e.status === 403) {
                toast.error(
                    `Sem permissão para ${origem} (sessão: ${eu?.perfil ?? 'desconhecida'}). Saia e entre com uma conta ADMIN.`,
                );
            }
        };
    }

    const criar = useMutation({
        mutationFn: () => api.post<UsuarioGestao>('/usuarios', novo).then((r) => r.dados),
        onSuccess: () => {
            invalidar();
            toast.success('Usuário criado com sucesso');
            setNovo({ nome: '', email: '', senha: '', perfil: 'CONSULTOR' });
            setModalCriar(false);
        },
        onError: erroMutacao('criar usuário'),
    });

    const salvarEdicao = useMutation({
        mutationFn: () =>
            api
                .put<UsuarioGestao>(`/usuarios/${editando!.id}`, { nome: novoNome, perfil: novoPerfil })
                .then((r) => r.dados),
        onSuccess: () => {
            invalidar();
            toast.success('Usuário atualizado');
            setEditando(null);
        },
        onError: erroMutacao('editar usuário'),
    });

    const alternarStatus = useMutation({
        mutationFn: (u: UsuarioGestao) => api.patch<UsuarioGestao>(`/usuarios/${u.id}`, { ativo: !u.ativo }).then((r) => r.dados),
        onSuccess: (u) => {
            invalidar();
            toast.success(u.ativo ? 'Usuário reativado' : 'Usuário desativado');
        },
        onError: erroMutacao('alterar status'),
    });

    const abrirEdicao = (u: UsuarioGestao) => {
        setEditando(u);
        setNovoNome(u.nome);
        setNovoPerfil(u.perfil);
    };

    const filtrados = useMemo(() => {
        if (!usuarios) return [];
        return usuarios.filter((u) => {
            const busca = termoBusca.toLowerCase();
            const matchBusca =
                u.nome.toLowerCase().includes(busca) ||
                u.email.toLowerCase().includes(busca);

            const matchPerfil = filtroPerfil === 'TODOS' || u.perfil === filtroPerfil;
            const matchStatus =
                filtroStatus === 'TODOS' ||
                (filtroStatus === 'ATIVOS' && u.ativo) ||
                (filtroStatus === 'INATIVOS' && !u.ativo);
            return matchBusca && matchPerfil && matchStatus;
        });
    }, [usuarios, termoBusca, filtroPerfil, filtroStatus]);

    const metricas = useMemo(() => {
        if (!usuarios) return { total: 0, admin: 0, gestor: 0, consultor: 0 };
        const admin = usuarios.filter((u) => u.perfil === 'ADMIN').length;
        const gestor = usuarios.filter((u) => u.perfil === 'GESTOR').length;
        const consultor = usuarios.filter((u) => u.perfil === 'CONSULTOR').length;
        return { total: usuarios.length, admin, gestor, consultor };
    }, [usuarios]);

    if (isError) {
        return <AcessoRestrito />;
    }

    // Sessão de apresentação sem ADMIN: nem exibe ações (o token real também
    // será negado com 403 pelo backend — ver erroMutacao).
    if (eu && eu.perfil !== 'ADMIN') {
        return <AcessoRestrito />;
    }

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <UsuariosHeader onCriar={() => setModalCriar(true)} />

            {/* Faixa de KPIs */}
            <UsuariosKpis metricas={metricas} isPending={isPending} />

            {/* Toolbar com Filtros */}
            <UsuariosToolbar
                termoBusca={termoBusca}
                onTermoBuscaChange={setTermoBusca}
                filtroPerfil={filtroPerfil}
                onFiltroPerfilChange={setFiltroPerfil}
                filtroStatus={filtroStatus}
                onFiltroStatusChange={setFiltroStatus}
            />

            {/* Tabela de Usuários */}
            <UsuariosTable
                dados={filtrados}
                isPending={isPending}
                onEditar={abrirEdicao}
                onAlternar={(u) => alternarStatus.mutate(u)}
                alternando={alternarStatus.isPending}
            />

            {/* Modal Criar */}
            <UsuarioCriarModal
                aberto={modalCriar}
                onAbertoChange={setModalCriar}
                novo={novo}
                onNovoChange={setNovo}
                onCriar={() => criar.mutate()}
                criando={criar.isPending}
            />

            {/* Modal Editar */}
            <UsuarioEditarModal
                editando={editando}
                onFechar={() => setEditando(null)}
                novoNome={novoNome}
                onNovoNomeChange={setNovoNome}
                novoPerfil={novoPerfil}
                onNovoPerfilChange={setNovoPerfil}
                onSalvar={() => salvarEdicao.mutate()}
                salvando={salvarEdicao.isPending}
            />
        </div>
    );
}
