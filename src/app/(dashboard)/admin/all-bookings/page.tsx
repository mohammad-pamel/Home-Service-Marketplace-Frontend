
import BookingListTable from "@/components/modules/booking-list/booking-list-table";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          View and monitor all customer bookings.
        </p>
      </div>

      <BookingListTable />
    </div>
  );
}
