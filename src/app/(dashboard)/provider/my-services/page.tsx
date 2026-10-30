
"use client";

import { useState } from "react";
import {
  useAvailableServices,
  useMyProviderServices,
  useAddProviderService,
  useUpdateProviderService,
  useRemoveProviderService,
} from "@/hooks/provider.hook";
import { toast } from "@/components/ui/toast";

export default function ProviderMyServicesPage() {
  const servicesQuery = useAvailableServices();
  const myServicesQuery = useMyProviderServices();

  const addMutation = useAddProviderService();
  const updateMutation = useUpdateProviderService();
  const removeMutation = useRemoveProviderService();

  const [serviceId, setServiceId] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const availableServices = servicesQuery.data?.data?.data ?? [];
  const myServices = myServicesQuery.data?.data ?? [];

  const isSaving =
    addMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending;

  const addedServiceIds = new Set(
    myServices.map((item) => item.serviceId),
  );

  function handleAddService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!serviceId || !price || Number(price) <= 0) {
      toast.add({
        title: "Invalid input",
        description: "Select a service and enter a valid price.",
        type: "error",
      });
      return;
    }

    addMutation.mutate(
      {
        serviceId,
        price: Number(price),
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Success",
            description: "Service added successfully.",
            type: "success",
          });
          setServiceId("");
          setPrice("");
        },
        onError: (error) => {
          toast.add({
            title: "Failed",
            description: error.message || "Could not add service.",
            type: "error",
          });
        },
      },
    );
  }

  function handleUpdate(serviceId: string) {
    if (!editPrice || Number(editPrice) <= 0) {
      toast.add({
        title: "Invalid price",
        description: "Enter a valid price.",
        type: "error",
      });
      return;
    }

    updateMutation.mutate(
      {
        serviceId,
        payload: {
          price: Number(editPrice),
        },
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Success",
            description: "Service price updated successfully.",
            type: "success",
          });
          setEditingId(null);
          setEditPrice("");
        },
        onError: (error) => {
          toast.add({
            title: "Failed",
            description: error.message || "Could not update price.",
            type: "error",
          });
        },
      },
    );
  }

  function handleRemove(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this service?",
    );

    if (!confirmed) return;

    removeMutation.mutate(id, {
      onSuccess: () => {
        toast.add({
          title: "Success",
          description: "Service removed successfully.",
          type: "success",
        });
      },
      onError: (error) => {
        toast.add({
          title: "Failed",
          description: error.message || "Could not remove service.",
          type: "error",
        });
      },
    });
  }

  if (servicesQuery.isLoading || myServicesQuery.isLoading) {
    return <div className="p-6">Loading services...</div>;
  }

  if (servicesQuery.isError || myServicesQuery.isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load services. Please try again.
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Services</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the services you provide and set your own prices.
        </p>
      </div>

      {/* Add Service */}
      <section className="space-y-4 rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Add New Service</h2>

        <form
          onSubmit={handleAddService}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-2">
            <label htmlFor="service" className="text-sm font-medium">
              Select Service
            </label>

            <select
              id="service"
              value={serviceId}
              onChange={(event) => setServiceId(event.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="">Choose a service</option>

              {availableServices
                .filter((service) => !addedServiceIds.has(service.id))
                .map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Your Price (BDT)
            </label>

            <input
              id="price"
              type="number"
              min="1"
              step="0.01"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Enter your service price"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving || availableServices.length === 0}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50 sm:col-span-2"
          >
            {addMutation.isPending ? "Adding..." : "Add Service"}
          </button>
        </form>
      </section>

      {/* My Services List */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">My Added Services</h2>
          <p className="text-sm text-muted-foreground">
            Total services: {myServices.length}
          </p>
        </div>

        {myServices.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <h3 className="font-semibold">No Services Added</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first service using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {myServices.map((item) => (
              <div
                key={item.id}
                className="space-y-4 rounded-xl border p-5"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.service.name}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.service.category?.name ?? "Uncategorized"}
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.service.description ?? "No description available."}
                  </p>
                </div>

                {editingId === item.id ? (
                  <div className="space-y-3">
                    <label
                      htmlFor={`price-${item.id}`}
                      className="text-sm font-medium"
                    >
                      Update Price (BDT)
                    </label>

                    <input
                      id={`price-${item.id}`}
                      type="number"
                      min="1"
                      step="0.01"
                      value={editPrice}
                      onChange={(event) =>
                        setEditPrice(event.target.value)
                      }
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleUpdate(item.id)}
                        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-md border px-4 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">
                      BDT {Number(item.price ?? item.service.basePrice).toLocaleString()}
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditPrice(
                            String(item.price ?? item.service.basePrice),
                          );
                        }}
                        className="rounded-md border px-3 py-2 text-sm"
                      >
                        Edit Price
                      </button>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleRemove(item.id)}
                        className="rounded-md border border-red-500 px-3 py-2 text-sm text-red-600 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
