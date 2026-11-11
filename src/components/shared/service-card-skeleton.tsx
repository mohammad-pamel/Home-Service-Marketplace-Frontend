import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col justify-between gap-5 rounded-xl border bg-card p-4 sm:p-5">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t pt-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-28" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 w-16 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}