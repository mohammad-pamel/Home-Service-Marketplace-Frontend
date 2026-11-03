
"use client";

import Link from "next/link";
import {
  AlertTriangle,
  RefreshCw,
  CalendarDays,
  Home,
  Headphones,
} from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border bg-card shadow-lg">
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-red-600">
            Payment Failed!
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Unfortunately, we couldn't process your payment.
            Your transaction was not completed successfully.
          </p>
        </div>

        <div className="mx-6 mb-6 rounded-xl border bg-muted/40 p-4">
          <div className="flex items-start gap-3">
            <Headphones className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

            <div>
              <h2 className="text-sm font-semibold">
                Need Help?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Please check your bKash transaction status before
                trying again. If money was deducted, contact support
                with your transaction details.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t p-6 sm:flex-row">
          <Link
            href="/customer/my-bookings"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            <RefreshCw size={18} />
            Try Again
          </Link>

          <Link
            href="/customer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold hover:bg-muted"
          >
            <Home size={18} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
