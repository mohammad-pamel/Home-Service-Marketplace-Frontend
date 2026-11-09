
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, UserRound, BriefcaseBusiness } from "lucide-react";

import { userLogin, getMe } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const roleRoutes: Record<string, string> = {
  ADMIN: "/admin",
  SUPER_ADMIN: "/admin",
  CUSTOMER: "/customer",
  PROVIDER: "/provider",
};

const demoAccounts = [
  {
    role: "ADMIN",
    label: "Admin",
    icon: ShieldCheck,
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD,
  },
  {
    role: "CUSTOMER",
    label: "Customer",
    icon: UserRound,
    email: process.env.NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD,
  },
  {
    role: "PROVIDER",
    label: "Provider",
    icon: BriefcaseBusiness,
    email: process.env.NEXT_PUBLIC_DEMO_PROVIDER_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_PROVIDER_PASSWORD,
  },
];

export default function DemoLoginButtons() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: userLogin,
  });

  const handleDemoLogin = async (
    account: (typeof demoAccounts)[number],
  ) => {
    if (!account.email || !account.password) {
      toast.add({
        title: "Demo Account Not Configured",
        description: `${account.label} demo credentials are missing.`,
        type: "error",
      });
      return;
    }

    try {
      setActiveRole(account.role);

      await loginMutation.mutateAsync({
        email: account.email,
        password: account.password,
      });

      const response = await getMe();

      const result = response as {
        data?: { role?: string };
        role?: string;
      };

      const role = result?.data?.role ?? result?.role;
      const dashboard = role ? roleRoutes[role] : undefined;

      if (!dashboard) {
        throw new Error("Unable to verify demo account role.");
      }

      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      toast.add({
        title: "Demo Login Successful",
        description: `Welcome to the ${account.label} dashboard.`,
        type: "success",
      });

      router.replace(dashboard);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to login with demo account.";

      toast.add({
        title: "Demo Login Failed",
        description: message,
        type: "error",
      });
    } finally {
      setActiveRole(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-semibold">Quick Demo Access</h3>
        <p className="text-sm text-muted-foreground">
          Explore the platform using a demo account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {demoAccounts.map((account) => {
          const Icon = account.icon;

          return (
            <Button
              key={account.role}
              type="button"
              variant="outline"
              className="h-auto min-h-20 flex-col gap-2"
              disabled={activeRole !== null}
              onClick={() => handleDemoLogin(account)}
            >
              <Icon className="size-5" />

              <span>
                {activeRole === account.role
                  ? "Logging in..."
                  : `${account.label} Demo Login`}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
