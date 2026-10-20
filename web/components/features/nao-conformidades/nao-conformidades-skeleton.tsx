import { Skeleton } from '@/components/ui/skeleton';

/** Fallback de streaming enquanto o pre-fetch server roda. */
export function NaoConformidadesSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-9 w-36" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <Skeleton className="h-9 w-full max-w-xl rounded-lg" />
            <Skeleton className="h-80 w-full rounded-xl" />
        </div>
    );
}
