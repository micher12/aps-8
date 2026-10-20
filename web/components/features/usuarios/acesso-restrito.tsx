import { ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function AcessoRestrito() {
    return (
        <Card className="border-destructive/40 bg-destructive/5 p-6">
            <div className="flex items-center gap-3 text-destructive">
                <ShieldAlert className="h-6 w-6 shrink-0" />
                <div>
                    <h2 className="text-lg font-bold">Acesso Restrito</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Este módulo de gestão de credenciais é restrito a usuários com perfil ADMIN.
                    </p>
                </div>
            </div>
        </Card>
    );
}
