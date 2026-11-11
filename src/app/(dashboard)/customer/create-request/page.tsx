
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useCreateServiceRequest } from "@/hooks/customer.hook";
import type { CreateServiceRequestPayload } from "@/types/service-request.type";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";

type ServiceOption = {
  id: string;
  name: string;
  category?: {
    name: string;
  };
};

const steps = [
  "Select Service",
  "Request Details",
  "Location & Schedule",
  "Review & Confirm",
];

export default function CreateServiceRequestPage() {
  const router = useRouter();
  const createRequest = useCreateServiceRequest();

  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState<CreateServiceRequestPayload>({
    serviceId: "",
    title: "",
    description: "",
    address: "",
    city: "",
    area: "",
    preferredDate: "",
    preferredTime: "",
  });

  const {
    data: servicesResponse,
    isLoading: servicesLoading,
    isError: servicesError,
    error: servicesQueryError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: () => apiClient("/services?status=active"),
    retry: false,
  });

  const servicesData = servicesResponse as
    | {
        data?: {
          data?: ServiceOption[];
        };
      }
    | undefined;

  const services: ServiceOption[] = servicesData?.data?.data ?? [];

  const selectedService = services.find(
    (service) => service.id === form.serviceId,
  );

  function updateField(
    field: keyof CreateServiceRequestPayload,
    value: string,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // Validate current step before moving forward
  function validateStep() {
    if (currentStep === 1 && !form.serviceId) {
      toast.add({
        title: "Service Required",
        description: "Please select a service.",
        type: "error",
      });
      return false;
    }

    if (currentStep === 2) {
      if (form.title.trim().length < 2) {
        toast.add({
          title: "Title Required",
          description: "Please enter a valid request title.",
          type: "error",
        });
        return false;
      }

      if (!form.description.trim()) {
        toast.add({
          title: "Description Required",
          description: "Please describe the service you need.",
          type: "error",
        });
        return false;
      }
    }

    if (currentStep === 3 && !form.address.trim()) {
      toast.add({
        title: "Address Required",
        description: "Please enter your service address.",
        type: "error",
      });
      return false;
    }

    return true;
  }

  function handleNext() {
    if (!validateStep()) return;

    setCurrentStep((previous) => Math.min(previous + 1, 4));
  }

  function handlePrevious() {
    setCurrentStep((previous) => Math.max(previous - 1, 1));
  }

  // API request happens ONLY after final confirmation
 async function handleSubmit() {
  if (currentStep !== 4 || createRequest.isPending) {
    return;
  }

  if (
    !form.serviceId ||
    !form.title.trim() ||
    !form.description.trim() ||
    !form.address.trim()
  ) {
    toast.add({
      title: "Missing Information",
      description: "Please complete all required fields.",
      type: "error",
    });
    return;
  }

  try {
    await createRequest.mutateAsync({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      address: form.address.trim(),
      city: form.city?.trim() || undefined,
      area: form.area?.trim() || undefined,
      preferredDate: form.preferredDate
        ? new Date(`${form.preferredDate}T00:00:00.000Z`).toISOString()
        : undefined,
      preferredTime: form.preferredTime || undefined,
    });

    toast.add({
      title: "Request Created",
      description: "Service request created successfully!",
      type: "success",
    });

    router.push("/customer/my-requests");
  } catch (error) {
    toast.add({
      title: "Request Failed",
      description:
        error instanceof Error
          ? error.message
          : "Failed to create service request.",
      type: "error",
    });
  }
}

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Create Service Request
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Follow the steps to request your desired service.
        </p>
      </div>

      {/* Step Progress */}
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold">
            Step {currentStep} of 4
          </p>
          <p className="text-sm text-muted-foreground">
            {steps[currentStep - 1]}
          </p>
        </div>

        <div className="flex gap-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const completed = currentStep > stepNumber;
            const active = currentStep === stepNumber;

            return (
              <div key={step} className="flex-1 space-y-2">
                <div
                  className={`h-2 rounded-full transition-colors ${
                    completed || active
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
                <p
                  className={`hidden text-xs sm:block ${
                    active
                      ? "font-semibold text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <div
  className="space-y-6 rounded-xl border bg-card p-5 md:p-7"
>
        {/* Step 1: Select Service */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">
                Select a Service
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose the service you need.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="serviceId" className="text-sm font-medium">
                Available Services *
              </label>

              <select
                id="serviceId"
                value={form.serviceId}
                onChange={(event) =>
                  updateField("serviceId", event.target.value)
                }
                disabled={servicesLoading}
                className="w-full rounded-lg border bg-background px-3 py-3 text-sm"
              >
                <option value="">
                  {servicesLoading
                    ? "Loading services..."
                    : "Select a service"}
                </option>

                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                    {service.category?.name
                      ? ` — ${service.category.name}`
                      : ""}
                  </option>
                ))}
              </select>

              {servicesError && (
                <p className="text-sm text-destructive">
                  {servicesQueryError instanceof Error
                    ? servicesQueryError.message
                    : "Failed to load services."}
                </p>
              )}

              {!servicesLoading &&
                !servicesError &&
                services.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No active services found.
                  </p>
                )}
            </div>
          </div>
        )}

        {/* Step 2: Request Details */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">
                Request Details
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Describe the problem or service you need.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Request Title *
              </label>
              <input
                id="title"
                required
                maxLength={150}
                value={form.title}
                onChange={(event) =>
                  updateField("title", event.target.value)
                }
                placeholder="e.g. AC is not cooling"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium"
              >
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={5}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Describe the problem or service you need..."
                className="w-full resize-y rounded-lg border bg-background px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        )}

        {/* Step 3: Location & Schedule */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">
                Location & Schedule
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Where and when do you need the service?
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Full Address *
              </label>
              <input
                id="address"
                required
                value={form.address}
                onChange={(event) =>
                  updateField("address", event.target.value)
                }
                placeholder="House, road, or street address"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <input
                  id="city"
                  value={form.city}
                  onChange={(event) =>
                    updateField("city", event.target.value)
                  }
                  placeholder="e.g. Chattogram"
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="area" className="text-sm font-medium">
                  Area
                </label>
                <input
                  id="area"
                  value={form.area}
                  onChange={(event) =>
                    updateField("area", event.target.value)
                  }
                  placeholder="e.g. Agrabad"
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="preferredDate"
                  className="text-sm font-medium"
                >
                  Preferred Date
                </label>
                <input
                  id="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={(event) =>
                    updateField("preferredDate", event.target.value)
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="preferredTime"
                  className="text-sm font-medium"
                >
                  Preferred Time
                </label>
                <input
                  id="preferredTime"
                  type="time"
                  value={form.preferredTime}
                  onChange={(event) =>
                    updateField("preferredTime", event.target.value)
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardCheck size={23} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  Review Your Request
                </h2>
                <p className="text-sm text-muted-foreground">
                  Check your information before submitting.
                </p>
              </div>
            </div>

            <div className="divide-y rounded-xl border">
              <div className="space-y-1 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  SELECTED SERVICE
                </p>
                <p className="font-medium">
                  {selectedService?.name || "Not selected"}
                </p>
                {selectedService?.category?.name && (
                  <p className="text-sm text-muted-foreground">
                    {selectedService.category.name}
                  </p>
                )}
              </div>

              <div className="space-y-1 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  REQUEST DETAILS
                </p>
                <p className="font-medium">{form.title}</p>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {form.description}
                </p>
              </div>

              <div className="space-y-1 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  SERVICE LOCATION
                </p>
                <p className="font-medium">{form.address}</p>
                <p className="text-sm text-muted-foreground">
                  {[form.area, form.city].filter(Boolean).join(", ") ||
                    "No additional location information"}
                </p>
              </div>

              <div className="space-y-1 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  PREFERRED SCHEDULE
                </p>
                <p className="font-medium">
                  {form.preferredDate || "No preferred date"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {form.preferredTime || "No preferred time"}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
              Please review all the information. Your service request
              will only be created after you click Confirm & Submit.
            </div>
          </div>
        )}

        {/* Navigation */}
       <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-between">
  <button
    type="button"
    onClick={handlePrevious}
    disabled={currentStep === 1 || createRequest.isPending}
    className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
  >
    <ChevronLeft size={17} />
    Previous
  </button>

  {currentStep < 4 ? (
    <button
      type="button"
      onClick={handleNext}
      disabled={
        servicesLoading ||
        (currentStep === 1 && services.length === 0)
      }
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Next
      <ChevronRight size={17} />
    </button>
  ) : (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={createRequest.isPending}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Check size={17} />
      {createRequest.isPending
        ? "Submitting..."
        : "Confirm & Submit"}
    </button>
  )}
</div>
      </div>
    </div>
  );
}
