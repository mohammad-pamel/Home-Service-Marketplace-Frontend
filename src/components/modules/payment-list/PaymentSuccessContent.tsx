
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  Receipt,
  CalendarCheck,
  Copy,
} from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("paymentId");
  const bookingId = searchParams.get("bookingId");
  const trxId = searchParams.get("trxId");
  const amount = searchParams.get("amount");
  const paidAt = searchParams.get("paidAt");

  const formattedDate = paidAt
    ? new Date(paidAt).toLocaleString()
    : "Payment completed";

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard permission may be unavailable.
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border bg-card shadow-lg">
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-green-600">
            Payment Successful!
          </h1>

          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Your payment has been completed successfully through bKash.
            Thank you for choosing our service.
          </p>

          {amount && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="mt-1 text-4xl font-bold">
                ৳{amount}
              </p>
            </div>
          )}
        </div>

        <div className="border-t px-6 py-6">
          <div className="mb-5 flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            <h2 className="font-semibold">Payment Details</h2>
          </div>

          <div className="space-y-4 text-sm">
            {paymentId && (
              <DetailRow
                label="Payment ID"
                value={paymentId}
                onCopy={() => copyText(paymentId)}
              />
            )}

            {trxId && (
              <DetailRow
                label="Transaction ID"
                value={trxId}
                onCopy={() => copyText(trxId)}
              />
            )}

            {bookingId && (
              <DetailRow
                label="Booking ID"
                value={bookingId}
                onCopy={() => copyText(bookingId)}
              />
            )}

            <DetailRow label="Payment Method" value="bKash" />
            <DetailRow label="Payment Status" value="SUCCESS" />
            <DetailRow label="Paid At" value={formattedDate} />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t p-6 sm:flex-row">
          <Link
            href="/customer/my-bookings"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            <CalendarCheck size={18} />
            My Bookings
          </Link>

          <Link
            href="/customer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold hover:bg-muted"
          >
            Dashboard
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-muted-foreground">{label}</span>

      <div className="flex min-w-0 items-center gap-2 text-right">
        <span className="break-all font-medium">{value}</span>

        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            title="Copy"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Copy size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
