
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerProfileSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      {/* Profile Form */}
      <div className="space-y-6 rounded-xl border p-5 sm:p-7">
        {/* Profile Heading */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-56 max-w-full" />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-lg" />
              {index === 1 && (
                <Skeleton className="h-3 w-52" />
              )}
            </div>
          ))}

          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
