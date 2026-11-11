import { Skeleton } from "@/components/ui/skeleton";

export default function AssignmentCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        {/* Information Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-32 max-w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-3 rounded-lg bg-muted/40 p-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>
    </div>
  );
}
