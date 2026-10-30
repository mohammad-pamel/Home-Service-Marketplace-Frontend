
"use client";

import { useMyBookings } from "@/hooks/provider.hook";
import type { Booking } from "@/types/booking.type";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function ProviderMyBookingsPage() {
  const { data, isLoading, isError } = useMyBookings();

  const bookings: Booking[] = data?.data ?? [];

  if (isLoading) {
    return <div className="p-6">Loading bookings...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load bookings. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage your assigned customer bookings.
        </p>
      </div>

      {/* Booking Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <h2 className="mt-2 text-2xl font-bold">{bookings.length}</h2>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <h2 className="mt-2 text-2xl font-bold">
            {bookings.filter((b) => b.status === "PENDING").length}
          </h2>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <h2 className="mt-2 text-2xl font-bold">
            {bookings.filter((b) => b.status === "IN_PROGRESS").length}
          </h2>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <h2 className="mt-2 text-2xl font-bold">
            {bookings.filter((b) => b.status === "COMPLETED").length}
          </h2>
        </div>
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Booking List</h2>

        {bookings.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            No bookings found.
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="space-y-4 rounded-lg border p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">
                    {booking.serviceRequest?.service?.name ??
                      "Service Booking"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Booking ID: {booking.id}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    statusStyles[booking.status] ??
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {booking.status.replaceAll("_", " ")}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium">
                    {booking.customer?.name ?? "Not available"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.customer?.email ?? ""}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Scheduled Date
                  </p>
                  <p className="font-medium">
                    {new Date(booking.scheduledAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="font-medium">
                    ৳{Number(booking.totalAmount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
