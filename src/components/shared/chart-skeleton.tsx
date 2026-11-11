import { Skeleton } from "@/components/ui/skeleton";

type ChartSkeletonProps = {
  title?: string;
  height?: string;
};

export default function ChartSkeleton({
  title = "Loading chart...",
  height = "h-72",
}: ChartSkeletonProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-5 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>

      <div className={`flex ${height} items-end gap-3`}>
        {[45, 70, 55, 85, 60, 95, 72, 50].map((value, index) => (
          <Skeleton
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            className="flex-1 rounded-t-md"
            style={{ height: `${value}%` }}
          />
        ))}
      </div>
    </div>
  );
}