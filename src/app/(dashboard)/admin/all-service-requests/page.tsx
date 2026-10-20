
import ServiceRequestListTable from "@/components/modules/service-request-list/service-request-list-table";

export default function AllServiceRequestsPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Service Requests
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage all customer service requests.
        </p>
      </div>

      <ServiceRequestListTable />
    </div>
  );
}
