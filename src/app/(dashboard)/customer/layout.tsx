import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
// import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["CUSTOMER"]}>
      {/** biome-ignore lint/a11y/useValidAriaRole: <explanation> */}
        <DashboardShell role="CUSTOMER">{children}</DashboardShell>

      {/* {children} */}
    </RoleGuard>
  );
}