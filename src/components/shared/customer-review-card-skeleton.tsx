
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerReviewCardSkeleton() {
  return (
    <article className="space-y-3 rounded-xl border p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<Skeleton key={index} className="h-4 w-4 rounded-sm" />
        ))}
        <Skeleton className="ml-2 h-4 w-10" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </article>
  );
}
