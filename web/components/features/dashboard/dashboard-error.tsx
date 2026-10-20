import { ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function DashboardError() {
    return (
        <Card className="border-destructive/40 bg-destructive/5 p-6">
            <div className="flex items-center gap-3 text-destructive">
                <ShieldAlert className="h-6 w-6 shrink-0" />
                <div>
                    <h2 className="text-lg font-bold">Erro de Conexão com o Web Service</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Verifique se o backend Spring Boot está ativo em <code>http://localhost:8080</code>.
                        Tentativas automáticas continuam em segundo plano.
                    </p>
                </div>
            </div>
        </Card>
    );
}
