'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Activity,
    BarChart3,
    ChevronRight,
    FileText,
    Flame,
    KeyRound,
    Leaf,
    ListChecks,
    LogOut,
    Recycle,
    ShieldAlert,
    ShieldCheck,
    Users,
    UsersRound,
    Radio,
} from 'lucide-react';
import { sair, useUsuario } from '@/lib/auth';
import { useWebSocketListeners } from '@/hooks/useWebSocket';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarSeparator,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const MENU = [
    { href: '/dashboard', label: 'Dashboard', icone: BarChart3 },
    { href: '/organizacoes', label: 'Organizações', icone: Leaf },
    { href: '/aspectos', label: 'Aspectos e Impactos', icone: ListChecks },
    { href: '/residuos', label: 'Resíduos', icone: Recycle },
    { href: '/licencas', label: 'Licenças', icone: KeyRound },
    { href: '/monitoramentos', label: 'Monitoramento', icone: Activity },
    { href: '/nao-conformidades', label: 'Não Conformidades', icone: ShieldAlert },
    { href: '/stakeholders', label: 'Stakeholders', icone: UsersRound },
    { href: '/relatorios', label: 'Relatórios', icone: FileText },
    { href: '/integracoes', label: 'Integrações', icone: Flame },
];

function iniciais(nome?: string): string {
    if (!nome) return '?';
    return nome
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const usuario = useUsuario();
    const { conectado } = useWebSocketListeners();

    const rotaAtual = MENU.find((m) => pathname.startsWith(m.href))?.label ??
        (pathname.startsWith('/usuarios') ? 'Gestão de Usuários' : 'SGAI-Go');

    return (
        <SidebarProvider>
            <Sidebar className="border-r border-sidebar-border bg-sidebar">
                <SidebarHeader className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fill text-primary-foreground">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-base font-bold tracking-tight text-sidebar-foreground">
                                SGAI<span className="text-primary">-Go</span>
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate">
                                ISO 14001 · Goiás
                            </span>
                        </div>
                    </div>
                </SidebarHeader>

                <SidebarSeparator />

                <SidebarContent className="px-2">
                    <SidebarGroup>
                        <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                            Módulos Ambientais
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="mt-1">
                            <SidebarMenu className="gap-1">
                                {MENU.map((item) => {
                                    const Icone = item.icone;
                                    const ativo = pathname.startsWith(item.href);
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton
                                                isActive={ativo}
                                                render={<Link href={item.href} />}
                                                className={`pressable h-9 rounded-lg font-medium transition-all ${ativo
                                                        ? 'bg-background text-foreground shadow-[0_0_0_1px_var(--sidebar-border)]'
                                                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                                                    }`}
                                            >
                                                <Icone className={`h-4 w-4 shrink-0 ${ativo ? 'text-primary' : 'text-muted-foreground'}`} />
                                                <span className="truncate">{item.label}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {usuario?.perfil === 'ADMIN' && (
                        <>
                            <SidebarSeparator className="my-2" />
                            <SidebarGroup>
                                <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                                    Administração
                                </SidebarGroupLabel>
                                <SidebarGroupContent className="mt-1">
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                isActive={pathname.startsWith('/usuarios')}
                                                render={<Link href="/usuarios" />}
                                                className={`pressable h-9 rounded-lg font-medium transition-all ${pathname.startsWith('/usuarios')
                                                        ? 'bg-background text-foreground shadow-[0_0_0_1px_var(--sidebar-border)]'
                                                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                                                    }`}
                                            >
                                                <Users className={`h-4 w-4 shrink-0 ${pathname.startsWith('/usuarios') ? 'text-primary' : 'text-muted-foreground'}`} />
                                                <span>Usuários</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </>
                    )}
                </SidebarContent>

                <SidebarFooter className="border-t border-sidebar-border p-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="pressable flex w-full items-center gap-3 rounded-lg border border-border/50 bg-background/40 p-2 text-left hover:bg-sidebar-accent transition-colors">
                            <Avatar className="h-9 w-9 shrink-0 border border-primary/20">
                                <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                                    {iniciais(usuario?.nome)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-sidebar-foreground">
                                    {usuario?.nome ?? 'Carregando…'}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                    {usuario?.perfil ?? 'SGAI-Go'}
                                </p>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="end" className="w-56 p-1.5 shadow-xl">
                            <DropdownMenuLabel className="px-2 py-1.5">
                                <p className="text-sm font-medium">{usuario?.nome}</p>
                                <p className="text-xs font-normal text-muted-foreground">{usuario?.email}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => void sair()}
                                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Encerrar Sessão
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset className="min-w-0 bg-background">
                <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="pressable h-8 w-8 text-muted-foreground hover:text-foreground" />
                        <Separator orientation="vertical" className="mx-1 h-5" />
                        <nav className="flex items-center gap-1 text-sm">
                            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                                SGAI-Go
                            </Link>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                            <span className="font-semibold text-foreground">
                                {rotaAtual}
                            </span>
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Badge
                            variant="outline"
                            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium transition-colors ${conectado
                                    ? 'border-success/40 bg-success/10 text-success-ink'
                                    : 'border-destructive/30 bg-destructive/10 text-destructive'
                                }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${conectado ? 'bg-success animate-pulse' : 'bg-destructive'
                                    }`}
                            />
                            <Radio className="h-3 w-3" />
                            <span className="hidden sm:inline">{conectado ? 'Tempo Real Ativo' : 'Offline'}</span>
                        </Badge>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto w-full max-w-7xl">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
