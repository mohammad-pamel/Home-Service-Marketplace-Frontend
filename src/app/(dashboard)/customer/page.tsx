"use client";

import Link from "next/link";
import {
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FileText,
  Search,
  UserRound,
  ArrowRight,
  Clock,
  CheckCircle2,
  Wrench,
} from "lucide-react";

const summaryCards = [
  {
    title: "My Requests",
    value: "—",
    description: "Track your service requests",
    icon: ClipboardList,
    href: "/customer/my-requests",
  },
  {
    title: "My Bookings",
    value: "—",
    description: "View your bookings",
    icon: CalendarCheck,
    href: "/customer/my-bookings",
  },
  {
    title: "My Estimates",
    value: "—",
    description: "Review service estimates",
    icon: FileText,
    href: "/customer/estimates",
  },
  {
    title: "Payments",
    value: "—",
    description: "Check your payment history",
    icon: CreditCard,
    href: "/customer/payments",
  },
];

const quickActions = [
  {
    title: "Browse Services",
    description: "Find the right professional for your needs.",
    icon: Search,
    href: "/services",
  },
  {
    title: "My Requests",
    description: "Check the status of your service requests.",
    icon: ClipboardList,
    href: "/customer/my-requests",
  },
  {
    title: "My Bookings",
    description: "View your upcoming and previous bookings.",
    icon: CalendarCheck,
    href: "/customer/my-bookings",
  },
  {
    title: "My Profile",
    description: "Manage your personal information.",
    icon: UserRound,
    href: "/customer/profile",
  },
];

export default function CustomerOverviewPage() {
  return (
    <main className="space-y-8 p-4 md:p-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">
            Customer Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Welcome Back!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your service requests, bookings, and payments in one place.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Search className="h-4 w-4" />
          Explore Services
        </Link>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Your Activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A quick look at your marketplace activity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-xl border bg-card p-5 transition hover:border-primary/50 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="mt-3 text-3xl font-bold">
                      {card.value}
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  {card.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                  View details
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Get Started</h2>
              <p className="text-sm text-muted-foreground">
                Need help with a home service?
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Explore available services, submit a request, and manage your
            bookings from your customer dashboard.
          </p>

          <Link
            href="/services"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Browse Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold">Booking Process</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Follow these steps to get your service completed.
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Search className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">1. Find a Service</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Choose a service that matches your needs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">2. Submit a Request</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Provide the details and preferred schedule.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">3. Confirm Your Booking</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Review the estimate and follow your booking status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold">Manage Your Account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Access your requests, bookings, estimates, and profile.
            </p>
          </div>

          <Link
            href="/customer/profile"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Update Profile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="flex items-start gap-3 rounded-lg border p-4 transition hover:bg-muted/50"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}