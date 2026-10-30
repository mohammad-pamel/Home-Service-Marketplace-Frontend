
"use client";

import { Button } from "@/components/ui/button";
import { useMyProviderPayments } from "@/hooks/provider.hook";
import type { Payment } from "@/types/payment.type";

function formatAmount(amount: number | string) {
  return `৳${Number(amount).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date?: string | null) {
  if (!date) return "Not paid yet";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProviderEarningsPage() {
  const {
    data: paymentResponse,
    isLoading,
    isError,
    refetch,
  } = useMyProviderPayments();

  const payments: Payment[] = paymentResponse?.data ?? [];

  const successfulPayments = payments.filter(
    (payment) => payment.status === "SUCCESS",
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING",
  );

  const failedPayments = payments.filter(
    (payment) =>
      payment.status === "FAILED" ||
      payment.status === "CANCELLED",
  );

  const totalEarnings = successfulPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  );

  if (isLoading) {
    return <div className="p-6">Loading earnings...</div>;
  }

  if (isError) {
    return (
      <div className="space-y-3 p-6">
        <p>Failed to load payment history.</p>
        <Button
          onClick={() => refetch()}
          className="rounded-md border px-4 py-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Earnings</h1>
        <p className="text-sm text-muted-foreground">
          Track your payments and earnings.
        </p>
      </div>

      {/* Earnings Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">Total Earnings</p>
          <h2 className="mt-2 text-2xl font-bold">
            {formatAmount(totalEarnings)}
          </h2>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">
            Successful Payments
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {successfulPayments.length}
          </h2>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">Pending Payments</p>
          <h2 className="mt-2 text-2xl font-bold">
            {pendingPayments.length}
          </h2>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">Failed Payments</p>
          <h2 className="mt-2 text-2xl font-bold">
            {failedPayments.length}
          </h2>
        </div>
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Payment History</h2>

        {payments.length === 0 ? (
          <div className="rounded-lg border p-8 text-center">
            <p className="font-medium">No payment history available</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your payments will appear here when customers make payments.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4">Service</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment Date</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t">
                    <td className="p-4">
                      {payment.booking?.serviceRequest?.service?.name ??
                        "Service"}
                    </td>

                    <td className="p-4">
                      {payment.booking?.customer?.name ?? "Customer"}
                    </td>

                    <td className="p-4 font-medium">
                      {formatAmount(payment.amount)}
                    </td>

                    <td className="p-4">{payment.provider}</td>

                    <td className="p-4">{payment.method}</td>

                    <td className="p-4">
                      <span className="rounded-full border px-2 py-1 text-xs">
                        {payment.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {formatDate(payment.paidAt ?? payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
