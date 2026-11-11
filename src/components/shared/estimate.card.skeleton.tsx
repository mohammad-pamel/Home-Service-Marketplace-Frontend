import { Skeleton } from "@/components/ui/skeleton";

export default function EstimateCardSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-28" />
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}