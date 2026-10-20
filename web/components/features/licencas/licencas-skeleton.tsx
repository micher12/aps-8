import { Skeleton } from '@/components/ui/skeleton';

/** Fallback de streaming enquanto o pre-fetch server roda. */
export function LicencasSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-9 w-36 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-9 w-full max-w-md rounded-lg" />
                <Skeleton className="h-9 w-56 rounded-lg" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
        </div>
    );
}
