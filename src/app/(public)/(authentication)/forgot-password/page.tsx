
"use client";

import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useForgotPassword } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

const ForgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const router = useRouter(); 

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: ForgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      forgotPassword(
        { email: value.email.trim() },
        {
          onSuccess: () => {
            toast.add({
              title: "OTP Sent Successfully",
              description:
                "Please check your email for the 6-digit OTP. It is valid for 5 minutes.",
              type: "success",
            });

            router.push(`/reset-password?email=${encodeURIComponent(value.email.trim())}`);

            // Reset page will be implemented next.
          },
          onError: (err) => {
            toast.add({
              title: "Request Failed",
              description:
                err.message || "Unable to send password reset OTP.",
              type: "error",
            });
          },
        }
      );
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-background p-6 shadow-sm sm:p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Forgot Password?
          </h1>

          <p className="text-sm text-muted-foreground">
            Enter your registered email address. We will send you a
            6-digit OTP to reset your password.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Email Address
                    </FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="Enter your registered email"
                      autoComplete="email"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />

                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Spinner />
                  Sending OTP...
                </>
              ) : (
                "Send Reset OTP"
              )}
            </Button>
          </FieldGroup>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
