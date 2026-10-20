import { Skeleton } from '@/components/ui/skeleton';

/** Fallback de streaming enquanto o pre-fetch server roda. */
export function IntegracoesSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-[440px] w-full rounded-xl" />
        </div>
    );
}
