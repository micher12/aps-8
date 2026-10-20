import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
    return (
        <div className="space-y-6" aria-label="Carregando sala de controle">
            <div className="space-y-2 border-t-4 border-double border-border pt-3">
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-8 w-80" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid grid-cols-1 divide-y divide-border/70 border-y border-border/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="space-y-2 px-4 py-4 first:pl-0 last:pr-0 sm:px-5">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-8 w-28" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>
            <div className="space-y-2 border-y border-border/70 py-4">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
            </div>
            <Skeleton className="h-72 w-full" />
        </div>
    );
}
