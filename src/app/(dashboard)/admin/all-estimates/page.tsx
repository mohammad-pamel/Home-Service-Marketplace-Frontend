import { EstimateListTable } from "@/components/modules/estimate-list/estimate-list-table";

export default function AdminEstimatesPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Estimates</h1>
        <p className="text-muted-foreground">
          View and monitor all service estimates.
        </p>
      </div>

      <EstimateListTable />
    </div>
  );
}