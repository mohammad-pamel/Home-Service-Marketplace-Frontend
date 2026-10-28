
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useCreateServiceRequest } from "@/hooks/customer.hook";
import type { CreateServiceRequestPayload } from "@/types/service-request.type";

type ServiceOption = {
  id: string;
  name: string;
  category?: {
    name: string;
  };
};

export default function CreateServiceRequestPage() {
  const router = useRouter();
  const createRequest = useCreateServiceRequest();

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

//   const { data: servicesResponse, isLoading: servicesLoading } = useQuery({
//     queryKey: ["services"],
//     queryFn: () => apiClient("/services"),
//     retry: false,
//   });

//   const services: ServiceOption[] = Array.isArray(servicesResponse)
//     ? servicesResponse
//     : Array.isArray(
//           (servicesResponse as { data?: ServiceOption[] } | undefined)?.data,
//         )
//       ? (servicesResponse as { data: ServiceOption[] }).data
//       : [];


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


  function updateField(
    field: keyof CreateServiceRequestPayload,
    value: string,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.serviceId) {
      toast.add({
  title: "Service Required",
  description: "Please select a service.",
  type: "error",
});
      return;
    }

    try {
    //   await createRequest.mutateAsync({
    //     ...form,
    //     city: form.city || undefined,
    //     area: form.area || undefined,
    //     preferredDate: form.preferredDate || undefined,
    //     preferredTime: form.preferredTime || undefined,
    //   });
    
await createRequest.mutateAsync({
  ...form,
  city: form.city || undefined,
  area: form.area || undefined,
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
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create service request.";

      toast.add({
  title: "Request Failed",
  description: message || "Failed to create service request.",
  type: "error",
});
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">Create Service Request</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us what service you need and where you need it.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border bg-card p-5 md:p-7"
      >
        <div className="space-y-2">
          <label htmlFor="serviceId" className="text-sm font-medium">
            Service *
          </label>
          <select
            id="serviceId"
            required
            value={form.serviceId}
            onChange={(event) => updateField("serviceId", event.target.value)}
            disabled={servicesLoading}
            className="w-full rounded-md border bg-background px-3 py-2.5"
          >
            <option value="">
              {servicesLoading ? "Loading services..." : "Select a service"}
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

         
{servicesError ? (
  <p className="text-sm text-red-500">
    Failed to load services: {servicesQueryError.message}
  </p>
) : !servicesLoading && services.length === 0 ? (
  <p className="text-sm text-muted-foreground">
    No active services found. Please try again later.
  </p>
) : null}

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
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="e.g. AC is not cooling"
            className="w-full rounded-md border bg-background px-3 py-2.5"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description *
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="Describe the problem or service you need..."
            className="w-full rounded-md border bg-background px-3 py-2.5"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">
            Address *
          </label>
          <input
            id="address"
            required
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            placeholder="House, road, or street address"
            className="w-full rounded-md border bg-background px-3 py-2.5"
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
              onChange={(event) => updateField("city", event.target.value)}
              placeholder="e.g. Chattogram"
              className="w-full rounded-md border bg-background px-3 py-2.5"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="area" className="text-sm font-medium">
              Area
            </label>
            <input
              id="area"
              value={form.area}
              onChange={(event) => updateField("area", event.target.value)}
              placeholder="e.g. Agrabad"
              className="w-full rounded-md border bg-background px-3 py-2.5"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="preferredDate" className="text-sm font-medium">
              Preferred Date
            </label>
            <input
              id="preferredDate"
              type="date"
              value={form.preferredDate}
              onChange={(event) =>
                updateField("preferredDate", event.target.value)
              }
              className="w-full rounded-md border bg-background px-3 py-2.5"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="preferredTime" className="text-sm font-medium">
              Preferred Time
            </label>
            <input
              id="preferredTime"
              type="time"
              value={form.preferredTime}
              onChange={(event) =>
                updateField("preferredTime", event.target.value)
              }
              className="w-full rounded-md border bg-background px-3 py-2.5"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={createRequest.isPending || servicesLoading || services.length === 0}
          className="w-full rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createRequest.isPending
            ? "Submitting..."
            : "Submit Service Request"}
        </button>
      </form>
    </div>
  );
}
