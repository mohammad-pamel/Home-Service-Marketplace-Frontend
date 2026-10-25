import { WorkLogListTable } from "@/components/modules/work-log-list/work-log-list-table";

export default function AdminWorkLogsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Work Logs</h1>
        <p className="text-muted-foreground">
          Monitor provider work progress and booking history.
        </p>
      </div>

      <WorkLogListTable />
    </div>
  );
}