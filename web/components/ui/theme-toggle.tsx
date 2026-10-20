'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

function subscribe() {
    return () => {};
}

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const montado = useSyncExternalStore(subscribe, () => true, () => false);

    const claro = montado ? resolvedTheme !== 'dark' : false;

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setTheme(claro ? 'dark' : 'light')}
            title={claro ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
            aria-label={claro ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
            className="pressable h-8 w-8 shrink-0"
        >
            {claro ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
    );
}
