
"use client";

import Link from "next/link";
import {
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FileText,
  ArrowRight,
  UserRound,
  Search,
} from "lucide-react";

import {
  useGetMyServiceRequests,
  useGetMyBookings,
  useGetMyEstimates,
  useGetMyPayments,
} from "@/hooks/customer.hook";

function getCount(result: unknown): number {
  if (!result || typeof result !== "object") return 0;

  const response = result as {
    data?: unknown;
  };

  if (Array.isArray(response.data)) {
    return response.data.length;
  }

  return 0;
}

export default function CustomerOverviewPage() {
  const requestsQuery = useGetMyServiceRequests();
  const bookingsQuery = useGetMyBookings();
  const estimatesQuery = useGetMyEstimates();
  const paymentsQuery = useGetMyPayments();

  const cards = [
    {
      title: "My Requests",
      value: getCount(requestsQuery.data),
      icon: ClipboardList,
      href: "/customer/my-requests",
    },
    {
      title: "My Bookings",
      value: getCount(bookingsQuery.data),
      icon: CalendarCheck,
      href: "/customer/my-bookings",
    },
    {
      title: "My Estimates",
      value: getCount(estimatesQuery.data),
      icon: FileText,
      href: "/customer/estimates",
    },
    {
      title: "Payments",
      value: getCount(paymentsQuery.data),
      icon: CreditCard,
      href: "/customer/payments",
    },
  ];

  const isLoading =
    requestsQuery.isLoading ||
    bookingsQuery.isLoading ||
    estimatesQuery.isLoading ||
    paymentsQuery.isLoading;

  return (
    <main className="space-y-8 p-4 md:p-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">
            Customer Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            Welcome Back!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your service requests, bookings, and payments.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <Search className="h-4 w-4" />
          Explore Services
        </Link>
      </section>

      {[
        requestsQuery,
        bookingsQuery,
        estimatesQuery,
        paymentsQuery,
      ].some((query) => query.isError) && (
        <div className="rounded-lg border border-destructive/30 p-4 text-sm text-destructive">
          Some dashboard information could not be loaded.
          Please refresh the page or log in again.
        </div>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Your Activity</h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-xl border bg-card p-5 transition hover:border-primary/50 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="mt-3 text-3xl font-bold">
                      {isLoading ? "..." : card.value}
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                  View details
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/customer/my-requests"
          className="rounded-xl border bg-card p-5 transition hover:bg-muted/50"
        >
          <ClipboardList className="mb-3 h-6 w-6 text-primary" />
          <h2 className="font-semibold">My Service Requests</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Track request status and review assigned providers.
          </p>
        </Link>

        <Link
          href="/customer/profile"
          className="rounded-xl border bg-card p-5 transition hover:bg-muted/50"
        >
          <UserRound className="mb-3 h-6 w-6 text-primary" />
          <h2 className="font-semibold">My Profile</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            View and manage your personal information.
          </p>
        </Link>
      </section>
    </main>
  );
}
