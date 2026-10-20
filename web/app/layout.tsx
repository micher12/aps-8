import type { Metadata } from 'next';
import { Geist_Mono, Inter, Inter_Tight } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

/* Substitutos documentados do SF Pro (protótipo SGAI-Go): Inter para texto,
   Inter Tight para display, Geist Mono para código. */
const interSans = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    display: 'swap',
});

const interTight = Inter_Tight({
    variable: '--font-inter-tight',
    subsets: ['latin'],
    display: 'swap',
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'SGAI-Go — Sistema de Gestão Ambiental Integrado de Goiás',
    description:
        'Sistema de Gestão Ambiental Integrado (ISO 14001) para monitoramento, conformidade legal e sustentabilidade em Goiás',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" className={`${interSans.variable} ${interTight.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
            <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
