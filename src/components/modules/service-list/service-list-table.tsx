"use client";

import { useState } from "react";
import { toast } from "@/components/ui/toast";
import {
  useCreateService,
  useDeleteService,
  useGetAllCategories,
  useGetAllServices,
  useUpdateService,
} from "@/hooks/admin.hook";
import type { Category, CreateServicePayload, Service } from "@/types";
import { Button } from "@/components/ui/button";

export default function ServiceListTable() {
  const { data, isLoading, isError } = useGetAllServices();
  const { data: categoryData } = useGetAllCategories();

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

//   const services: Service[] = data?.data ?? [];
// const services: Service[] = Array.isArray(data?.data)
//   ? data.data
//   : Array.isArray(data)
//     ? data
//     : [];

const services: Service[] = Array.isArray(data?.data?.data)
  ? data.data.data
  : [];
  const categories: Category[] = categoryData?.data ?? [];

  console.log("Services API response:", data);
console.log("Services data:", data?.data);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    basePrice: "",
    durationMinutes: "",
  });

  const [formError, setFormError] = useState("");

  function resetForm() {
    setForm({
      categoryId: "",
      name: "",
      slug: "",
      description: "",
      basePrice: "",
      durationMinutes: "",
    });
    setEditingService(null);
    setFormError("");
    setIsFormOpen(false);
  }

  function openCreateForm() {
    setEditingService(null);
    setForm({
      categoryId: "",
      name: "",
      slug: "",
      description: "",
      basePrice: "",
      durationMinutes: "",
    });
    setFormError("");
    setIsFormOpen(true);
  }

  function openUpdateForm(service: Service) {
    setEditingService(service);
    setForm({
      categoryId: service.categoryId,
      name: service.name,
      slug: service.slug,
      description: service.description ?? "",
      basePrice: String(service.basePrice),
      durationMinutes:
        service.durationMinutes == null ? "" : String(service.durationMinutes),
    });
    setFormError("");
    setIsFormOpen(true);
  }

  function handleNameChange(name: string) {
    setForm((previous) => ({
      ...previous,
      name,
      slug: editingService
        ? previous.slug
        : name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!form.categoryId) {
      setFormError("Please select a category.");
      return;
    }

    if (!form.name.trim() || !form.slug.trim()) {
      setFormError("Service name and slug are required.");
      return;
    }

    if (
      form.basePrice.trim() === "" ||
      !Number.isFinite(Number(form.basePrice)) ||
      Number(form.basePrice) < 0
    ) {
      setFormError("Please enter a valid base price.");
      return;
    }

    if (
      form.durationMinutes.trim() !== "" &&
      (!Number.isInteger(Number(form.durationMinutes)) ||
        Number(form.durationMinutes) < 1)
    ) {
      setFormError("Duration must be a positive whole number.");
      return;
    }

    const payload: CreateServicePayload = {
      categoryId: form.categoryId,
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || undefined,
      basePrice: Number(form.basePrice),
      durationMinutes:
        form.durationMinutes.trim() === ""
          ? undefined
          : Number(form.durationMinutes),
    };

    const options = {
      onSuccess: () => {
        toast.add({
          title: editingService ? "Service updated" : "Service created",
          description: editingService
            ? "The service was updated successfully."
            : "The new service was created successfully.",
          type: "success" as const,
        });
        resetForm();
      },
      onError: () => {
        setFormError(
          "Could not save the service. Check the fields and your admin login, then try again.",
        );
      },
    };

    if (editingService) {
      updateMutation.mutate({ serviceId: editingService.id, payload }, options);
    } else {
      createMutation.mutate(payload, options);
    }
  }

  function handleDelete(service: Service) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`,
    );

    if (!confirmed) return;

    deleteMutation.mutate(service.id, {
      onSuccess: () => {
        toast.add({
          title: "Service deleted",
          description: `${service.name} was deleted successfully.`,
          type: "success",
        });
      },
      onError: () => {
        toast.add({
          title: "Delete failed",
          description: "Could not delete this service.",
          type: "error",
        });
      },
    });
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-sm text-gray-500">
            Manage your marketplace services.
          </p>
        </div>

        <Button
          type="button"
          onClick={openCreateForm}
          className="rounded-md px-4 py-2 text-white hover:bg-green-600"
        >
          + Create Service
        </Button>
      </div>

      {isFormOpen && (
        <div className="rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold">
            {editingService ? "Update Service" : "Create Service"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label
                  htmlFor="service-category"
                  className="text-sm font-medium"
                >
                  Category *
                </label>
                <select
                  id="service-category"
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      categoryId: event.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="service-name" className="text-sm font-medium">
                  Service Name *
                </label>
                <input
                  id="service-name"
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  required
                  placeholder="e.g. Home Cleaning"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="service-slug" className="text-sm font-medium">
                  Slug *
                </label>
                <input
                  id="service-slug"
                  value={form.slug}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      slug: event.target.value,
                    }))
                  }
                  required
                  placeholder="home-cleaning"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="service-price" className="text-sm font-medium">
                  Base Price *
                </label>
                <input
                  id="service-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.basePrice}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      basePrice: event.target.value,
                    }))
                  }
                  required
                  placeholder="e.g. 1500"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="service-duration"
                  className="text-sm font-medium"
                >
                  Duration (Minutes)
                </label>
                <input
                  id="service-duration"
                  type="number"
                  min="1"
                  step="1"
                  value={form.durationMinutes}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      durationMinutes: event.target.value,
                    }))
                  }
                  placeholder="e.g. 60"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="service-description"
                className="text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="service-description"
                value={form.description}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                rows={3}
                placeholder="Describe this service..."
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            {formError && (
              <p role="alert" className="text-sm text-red-600">
                {formError}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-md px-4 py-2 text-white "
              >
                {isSaving
                  ? "Saving..."
                  : editingService
                    ? "Update Service"
                    : "Create Service"}
              </Button>

              <Button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                className="rounded-md border px-4 py-2"
                variant="outline"
                // variant={"destructive"}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="py-8 text-center">Loading services...</p>
      ) : isError ? (
        <p role="alert" className="py-8 text-center text-red-600">
          Failed to load services. Please try again.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Base Price</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    No services found.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{service.name}</td>
                    <td className="px-4 py-3">
                      {service.category?.name ??
                        categories.find(
                          (category) => category.id === service.categoryId,
                        )?.name ??
                        "—"}
                    </td>
                    <td className="px-4 py-3">
                      {Number(service.basePrice).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {service.durationMinutes == null
                        ? "—"
                        : `${service.durationMinutes} min`}
                    </td>
                    <td className="px-4 py-3">{service.slug}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={() => openUpdateForm(service)}
                          className="rounded border px-3 py-1 hover:bg-green-600"
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleDelete(service)}
                          disabled={deleteMutation.isPending}
                          className="bg-red-100 hover:bg-red-400 text-red-600" variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
