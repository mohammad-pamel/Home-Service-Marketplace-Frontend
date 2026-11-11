"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import { useMyProviderPayments } from "@/hooks/provider.hook";
import type { Payment } from "@/types/payment.type";
import { Wallet, CheckCircle2, Clock, XCircle } from "lucide-react";
import SummaryCard from "@/components/shared/summary-card";
import { Skeleton } from "@/components/ui/skeleton";

function formatAmount(amount: number | string) {
  return `৳${Number(amount).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date?: string | Date | null) {
  if (!date) return "Not paid yet";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const statusOptions = ["ALL", "SUCCESS", "PENDING", "FAILED", "CANCELLED"];

function getStatusStyle(status: string) {
  switch (status) {
    case "SUCCESS":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "FAILED":
    case "CANCELLED":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

// function SummaryCard({
//   title,
//   value,
//   icon: Icon,
//   description,
// }: {
//   title: string;
//   value: string;
//   icon: React.ElementType;
//   description: string;
// }) {
//   return (
//     <div className="rounded-xl border bg-card p-5">
//       <div className="flex items-center justify-between gap-3">
//         <p className="text-sm text-muted-foreground">{title}</p>
//         <div className="rounded-lg bg-muted p-2">
//           <Icon className="h-5 w-5 text-muted-foreground" />
//         </div>
//       </div>
//       <h2 className="mt-3 text-2xl font-bold">{value}</h2>
//       <p className="mt-1 text-xs text-muted-foreground">{description}</p>
//     </div>
//   );
// }

export default function ProviderEarningsPage() {
  const {
    data: paymentResponse,
    isLoading,
    isError,
    refetch,
  } = useMyProviderPayments();

  const payments: Payment[] = paymentResponse?.data ?? [];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const successfulPayments = payments.filter(
    (payment) => payment.status === "SUCCESS",
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING",
  );

  const failedPayments = payments.filter(
    (payment) => payment.status === "FAILED" || payment.status === "CANCELLED",
  );

  const totalEarnings = successfulPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  );

  const paymentMethods = [
    ...new Set(payments.map((payment) => payment.method)),
  ];

  const filteredPayments = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    const result = payments.filter((payment) => {
      const serviceName = payment.booking?.serviceRequest?.service?.name ?? "";

      const customerName = payment.booking?.customer?.name ?? "";

      const matchesSearch =
        !search ||
        serviceName.toLowerCase().includes(search) ||
        customerName.toLowerCase().includes(search) ||
        payment.id.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "ALL" || payment.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "amount-high":
          return Number(b.amount) - Number(a.amount);
        case "amount-low":
          return Number(a.amount) - Number(b.amount);
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });
  }, [payments, searchTerm, statusFilter, methodFilter, sortBy]);

  const columns: DataTableColumn<Payment>[] = [
    {
      key: "service",
      header: "Service",
      cell: (payment) => (
        <span className="block max-w-[220px] truncate font-medium">
          {payment.booking?.serviceRequest?.service?.name ?? "Service"}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (payment) => payment.booking?.customer?.name ?? "Customer",
    },
    {
      key: "amount",
      header: "Amount",
      cell: (payment) => (
        <span className="whitespace-nowrap font-semibold">
          {formatAmount(payment.amount)}
        </span>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      cell: (payment) => payment.provider,
    },
    {
      key: "method",
      header: "Method",
      cell: (payment) => payment.method,
    },
    {
      key: "status",
      header: "Status",
      cell: (payment) => (
        <span
          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(payment.status)}`}
        >
          {payment.status}
        </span>
      ),
    },
    {
      key: "paymentDate",
      header: "Payment Date",
      cell: (payment) => (
        <span className="whitespace-nowrap">
          {formatDate(payment.paidAt ?? payment.createdAt)}
        </span>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-muted-foreground">Failed to load payment history.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      {isLoading ? (
  <div className="space-y-3">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-64 max-w-full" />
  </div>
) : (
  <div>
    <h1 className="text-2xl font-bold sm:text-3xl">My Earnings</h1>
    <p className="mt-1 text-sm text-muted-foreground">
      Track your payments and earnings.
    </p>
  </div>
)}

      {/* Earnings Summary */}
      {/* Earnings Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Earnings"
          value={formatAmount(totalEarnings)}
          icon={Wallet}
          description="From successful payments"
          isLoading={isLoading}
        />

        <SummaryCard
          title="Successful Payments"
          value={String(successfulPayments.length)}
          icon={CheckCircle2}
          description="Successfully completed"
          isLoading={isLoading}
        />

        <SummaryCard
          title="Pending Payments"
          value={String(pendingPayments.length)}
          icon={Clock}
          description="Awaiting confirmation"
          isLoading={isLoading}
        />

        <SummaryCard
          title="Failed Payments"
          value={String(failedPayments.length)}
          icon={XCircle}
          description="Failed or cancelled"
          isLoading={isLoading}
        />
      </div>

      {/* Payment History */}
      {isLoading ? (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-64 max-w-full" />
  </div>
) : (
  <div className="space-y-4">
  <div>
    <h2 className="text-lg font-semibold">Payment History</h2>
    <p className="text-sm text-muted-foreground">
      Search and filter your payment transactions.
    </p>
  </div>
  </div>
)}

        <DataTable
          columns={columns}
          data={filteredPayments}
          isLoading={isLoading}
          skeletonRows={6}
          emptyTitle={
            payments.length === 0
              ? "No payment history available"
              : "No matching payments found"
          }
          emptyDescription={
            payments.length === 0
              ? "Your payments will appear here when customers make payments."
              : "Try changing your search term or filters."
          }
          caption={`Showing ${filteredPayments.length} of ${payments.length} payments`}
          
toolbar={
  isLoading ? (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Skeleton className="h-10 w-full sm:col-span-2 xl:col-span-1" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  ) : (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Input
        placeholder="Search service, customer, payment ID..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="sm:col-span-2 xl:col-span-1"
      />

      <select
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
        aria-label="Filter payments by status"
        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status === "ALL" ? "All Status" : status}
          </option>
        ))}
      </select>

      <select
        value={methodFilter}
        onChange={(event) => setMethodFilter(event.target.value)}
        aria-label="Filter payments by method"
        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
      >
        <option value="ALL">All Methods</option>
        {paymentMethods.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
        aria-label="Sort payments"
        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="amount-high">Amount: High to Low</option>
        <option value="amount-low">Amount: Low to High</option>
      </select>
    </div>
  )
}

        />
      </div>
    // </div>
  );
}
