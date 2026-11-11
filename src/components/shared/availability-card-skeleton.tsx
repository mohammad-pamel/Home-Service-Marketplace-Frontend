import { Skeleton } from "@/components/ui/skeleton";

export default function AvailabilityCardSkeleton() {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center">
      <div className="space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-9 w-16 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  );
}