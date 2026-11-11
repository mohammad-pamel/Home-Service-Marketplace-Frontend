
import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceRequestCardSkeleton() {
  return (
    <div className="space-y-5 rounded-xl border bg-card p-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-56 max-w-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Location and Date */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-4 w-40 max-w-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-4 w-36 max-w-full" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
        <Skeleton className="h-3 w-48 max-w-full" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  );
}
