import type { ElementType } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type SummaryCardProps = {
  title: string;
  value: string;
  icon: ElementType;
  description: string;
  isLoading?: boolean;
};

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  description,
  isLoading = false,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        {isLoading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <p className="text-sm text-muted-foreground">{title}</p>
        )}

        {isLoading ? (
          <Skeleton className="h-10 w-10 rounded-lg" />
        ) : (
          <div className="rounded-lg bg-muted p-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="mt-4 h-8 w-28" />
      ) : (
        <h2 className="mt-3 text-2xl font-bold">{value}</h2>
      )}

      {isLoading ? (
        <Skeleton className="mt-3 h-3 w-36" />
      ) : (
        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}