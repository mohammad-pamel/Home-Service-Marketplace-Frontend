
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerPaymentCardSkeleton() {
  return (
    <article className="space-y-5 rounded-xl border p-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex items-start gap-3">
          <Skeleton className="h-11 w-11 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-56 max-w-full" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>

        <div className="space-y-2 sm:text-right">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-6 w-24 rounded-full sm:ml-auto" />
        </div>
      </div>

      {/* Payment Details */}
      <div className="grid gap-4 border-t pt-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-36 max-w-full" />
          </div>
        ))}
      </div>
    </article>
  );
}
