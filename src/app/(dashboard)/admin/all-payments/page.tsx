// import PaymentListTable from "@/components/modules/payment-list/payment-list-table";

import PaymentListTable from "@/components/modules/payment-list/payment-list-table";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">
          View and monitor all customer payments.
        </p>
      </div>

      {/* <PaymentListTable /> */}
      <PaymentListTable></PaymentListTable>
    </div>
  );
}