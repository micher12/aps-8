'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30_000,
                        retry: (failureCount, error) => {
                            const status = (error as { status?: number })?.status;
                            // 4xx (400/401/403/404/409/422/429…) não melhora com retry — só rede/5xx
                            if (status && status < 500) return false;
                            return failureCount < 2;
                        },
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={client}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                <TooltipProvider delay={200}>
                    {children}
                    <Toaster position="bottom-right" richColors closeButton />
                </TooltipProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
