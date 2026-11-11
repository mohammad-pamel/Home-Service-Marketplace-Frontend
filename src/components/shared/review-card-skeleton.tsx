
import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewCardSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border bg-card p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<Skeleton key={index} className="h-4 w-4 rounded-sm" />
        ))}
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}
