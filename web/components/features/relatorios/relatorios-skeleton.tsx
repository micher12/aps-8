import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function RelatoriosSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <Card className="border-border/80 bg-card/60 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-3 w-80" />
                    </div>
                    <Skeleton className="h-10 w-full sm:w-72 rounded-lg" />
                </div>
            </Card>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="border-border/80 bg-card p-6 space-y-3">
                        <div className="flex items-start justify-between">
                            <Skeleton className="h-11 w-11 rounded-xl" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </Card>
                ))}
            </div>
        </div>
    );
}
