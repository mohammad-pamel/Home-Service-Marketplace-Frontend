
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { useResetPassword } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const ResetPasswordSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordMutation = useResetPassword();

  const form = useForm({
    defaultValues: {
      email: searchParams.get("email") ?? "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const result = ResetPasswordSchema.safeParse(value);

      if (!result.success) {
        toast.add({
          title: "Invalid Information",
          description:
            result.error.issues[0]?.message ??
            "Please check your inputs.",
          type: "error",
        });
        return;
      }

      const { email, otp, newPassword } = result.data;

      resetPasswordMutation.mutate(
        { email: email.trim(), otp, newPassword },
        {
          onSuccess: () => {
            toast.add({
              title: "Password Reset Successful",
              description: "You can now log in with your new password.",
              type: "success",
            });

            router.replace("/login");
          },
          onError: (error) => {
            toast.add({
              title: "Password Reset Failed",
              description:
                error.message || "Something went wrong. Please try again.",
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email, the OTP sent to your inbox, and your new password.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <form.Field
              name="email"
              // biome-ignore lint/correctness/noChildrenProp: TanStack Form render prop
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Email Address
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="Enter your email"
                    value={field.state.value}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                  />
                </Field>
              )}
            />

            <form.Field
              name="otp"
              // biome-ignore lint/correctness/noChildrenProp: TanStack Form render prop
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>6-Digit OTP</FieldLabel>
                  <Input
                    id={field.name}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter OTP"
                    value={field.state.value}
                    onChange={(event) =>
                      field.handleChange(
                        event.target.value.replace(/\D/g, ""),
                      )
                    }
                  />
                </Field>
              )}
            />

            <form.Field
              name="newPassword"
              // biome-ignore lint/correctness/noChildrenProp: TanStack Form render prop
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    New Password
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="Enter new password"
                    value={field.state.value}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                  />
                </Field>
              )}
            />

            <form.Field
              name="confirmPassword"
              // biome-ignore lint/correctness/noChildrenProp: TanStack Form render prop
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Confirm New Password
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="Confirm new password"
                    value={field.state.value}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                  />
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            className="w-full"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending
              ? "Resetting Password..."
              : "Reset Password"}
          </Button>
        </form>

        <p className="text-center text-sm">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline underline-offset-4"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading reset password page...
          </p>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
