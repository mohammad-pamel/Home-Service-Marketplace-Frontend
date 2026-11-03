
"use client";

import { useState } from "react";
import {
  CalendarDays,
  RefreshCw,
  CalendarCheck,
  UserRound,
  CreditCard,
} from "lucide-react";

import { useCreateCustomerPayment, useGetMyBookings } from "@/hooks/customer.hook";
import { toast } from "@/components/ui/toast";
import type { Booking } from "@/types/booking.type";

const statusOptions = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

type StatusFilter = (typeof statusOptions)[number];

export default function MyBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const { data, isLoading, isError, refetch } = useGetMyBookings();
  const createPaymentMutation = useCreateCustomerPayment();

  const response = data as { data?: Booking[] } | undefined;
  const bookings = response?.data ?? [];

  const filteredBookings =
    statusFilter === "ALL"
      ? bookings
      : bookings.filter((booking) => booking.status === statusFilter);

  const handlePayment = (bookingId: string) => {
    createPaymentMutation.mutate(
      {
        bookingId,
        provider: "BKASH",
        method: "MOBILE_BANKING",
      },
      {
        onSuccess: (response) => {
          const paymentUrl = response.data?.paymentUrl;

          if (!paymentUrl) {
            toast.add({
              title: "Payment Error",
              description: "bKash payment URL was not returned.",
              type: "error",
            });
            return;
          }

          window.location.href = paymentUrl;
        },
        onError: (error: unknown) => {
          const paymentError = error as {
            data?: { message?: string };
            message?: string;
          };

          toast.add({
            title: "Payment Failed",
            description:
              paymentError.data?.message ??
              paymentError.message ??
              "Unable to start payment.",
            type: "error",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <RefreshCw className="animate-spin" />
        <span className="ml-2">Loading bookings...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border p-6 text-center">
        <p className="text-red-500">Failed to load your bookings.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your service bookings and payments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Bookings"
          value={bookings.length}
          icon={<CalendarDays size={20} />}
        />
        <SummaryCard
          title="Pending"
          value={bookings.filter((b) => b.status === "PENDING").length}
          icon={<RefreshCw size={20} />}
        />
        <SummaryCard
          title="Confirmed"
          value={bookings.filter((b) => b.status === "CONFIRMED").length}
          icon={<CalendarCheck size={20} />}
        />
        <SummaryCard
          title="Completed"
          value={bookings.filter((b) => b.status === "COMPLETED").length}
          icon={<CreditCard size={20} />}
        />
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              statusFilter === status
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {status === "ALL" ? "All" : status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Booking List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <CalendarDays className="mx-auto mb-3 text-muted-foreground" size={36} />
          <h2 className="font-semibold">No bookings found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You do not have any bookings in this category.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => {
            const hasPendingPayment = booking.payments?.some(
              (payment) =>
                payment.provider === "BKASH" &&
                payment.status === "PENDING"
            );

            const hasSuccessfulPayment = booking.payments?.some(
              (payment) => payment.status === "SUCCESS"
            );

            const canPay =
              booking.estimate?.status === "APPROVED" &&
              !hasPendingPayment &&
              !hasSuccessfulPayment &&
              booking.status !== "CANCELLED" &&
              booking.status !== "COMPLETED";

            const serviceName =
              booking.serviceRequest?.service?.name ?? "Service";

            const providerName =
              booking.provider?.name ?? "Not assigned";

            return (
              <div
                key={booking.id}
                className="rounded-xl border bg-card p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{serviceName}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Booking ID: {booking.id}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      booking.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : booking.status === "CONFIRMED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {booking.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <UserRound size={18} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Provider</p>
                      <p className="text-sm font-medium">{providerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CalendarDays size={18} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Booking Date</p>
                      <p className="text-sm font-medium">
                        {booking.createdAt
                          ? new Date(booking.createdAt).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard size={18} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Estimate Amount
                      </p>
                      <p className="text-sm font-medium">
                        ৳{booking.estimate?.total ?? booking.totalAmount ?? "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Estimate Status
                    </p>
                    <p className="text-sm font-medium">
                      {booking.estimate?.status ?? "Not available"}
                    </p>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="mt-5 border-t pt-4">
                  {canPay && (
                    <button
                      type="button"
                      onClick={() => handlePayment(booking.id)}
                      disabled={createPaymentMutation.isPending}
                      className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {createPaymentMutation.isPending
                        ? "Redirecting..."
                        : "Pay Now with bKash"}
                    </button>
                  )}

                  {hasSuccessfulPayment && (
                    <p className="text-sm font-medium text-green-600">
                      Payment completed successfully.
                    </p>
                  )}

                  {hasPendingPayment && (
                    <p className="text-sm text-amber-600">
                      Payment is pending. Please complete your bKash checkout.
                    </p>
                  )}

                  {!canPay &&
                    !hasPendingPayment &&
                    !hasSuccessfulPayment &&
                    booking.estimate?.status !== "APPROVED" && (
                      <p className="text-sm text-muted-foreground">
                        Payment will be available after your estimate is approved.
                      </p>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}
