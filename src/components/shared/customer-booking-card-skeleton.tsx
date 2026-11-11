
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerBookingCardSkeleton() {
  return (
    <div className="space-y-5 rounded-xl border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-64 max-w-full" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Booking Information */}
      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-32 max-w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Payment Section */}
      <div className="flex flex-col justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
        <Skeleton className="h-4 w-48 max-w-full" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </div>
  );
}
