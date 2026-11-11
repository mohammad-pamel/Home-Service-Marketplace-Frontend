
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerEstimateCardSkeleton() {
  return (
    <article className="space-y-4 rounded-xl border p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56 max-w-full" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Amount */}
      <div className="space-y-2 rounded-lg bg-muted/50 p-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-36" />
      </div>

      {/* Details */}
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 3 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Actions */}
      <div className="flex gap-3 border-t pt-4">
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </article>
  );
}
