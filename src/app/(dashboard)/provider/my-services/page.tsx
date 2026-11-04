"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  useAvailableServices,
  useMyProviderServices,
  useAddProviderService,
  useUpdateProviderService,
  useRemoveProviderService,
} from "@/hooks/provider.hook";
import { toast } from "@/components/ui/toast";
import {
  Search,
  X,
  BriefcaseBusiness,
  Plus,
  Pencil,
  Trash2,
  Tag,
  DollarSign,
  Layers,
  CheckCircle2,
  PackageOpen,
} from "lucide-react";

type SortOption = "DEFAULT" | "PRICE_LOW" | "PRICE_HIGH" | "NAME";

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

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("DEFAULT");

  const availableServices = servicesQuery.data?.data?.data ?? [];
  const myServices = myServicesQuery.data?.data ?? [];

  const isSaving =
    addMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending;

  const addedServiceIds = new Set(
    myServices.map((item) => item.serviceId),
  );

  // Unique categories
  const categories = Array.from(
    new Set(
      myServices
        .map((item) => item.service.category?.name)
        .filter((name): name is string => Boolean(name)),
    ),
  );

  // Search, Filter and Sort
  const filteredServices = useMemo(() => {
    let result = myServices.filter((item) => {
      const searchText = [
        item.service.name,
        item.service.category?.name,
        item.service.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(
        search.trim().toLowerCase(),
      );

      const matchesCategory =
        categoryFilter === "ALL" ||
        item.service.category?.name === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "PRICE_LOW") {
      result = [...result].sort(
        (a, b) =>
          Number(a.price ?? a.service.basePrice) -
          Number(b.price ?? b.service.basePrice),
      );
    } else if (sortBy === "PRICE_HIGH") {
      result = [...result].sort(
        (a, b) =>
          Number(b.price ?? b.service.basePrice) -
          Number(a.price ?? a.service.basePrice),
      );
    } else if (sortBy === "NAME") {
      result = [...result].sort((a, b) =>
        a.service.name.localeCompare(b.service.name),
      );
    }

    return result;
  }, [myServices, search, categoryFilter, sortBy]);

  function handleAddService(event: FormEvent<HTMLFormElement>) {
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

  function handleUpdate(id: string) {
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
        serviceId: id,
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

  function resetFilters() {
    setSearch("");
    setCategoryFilter("ALL");
    setSortBy("DEFAULT");
  }

  if (servicesQuery.isLoading || myServicesQuery.isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center gap-3 text-muted-foreground">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm font-medium">Loading services...</span>
      </div>
    );
  }

  if (servicesQuery.isError || myServicesQuery.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/20">
        <h2 className="font-semibold text-red-600">
          Failed to load services
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <BriefcaseBusiness size={22} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              My Services
            </h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your services and set your own prices.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard
          title="Total Services"
          value={myServices.length}
          icon={<Layers size={19} />}
        />

        <SummaryCard
          title="Available Services"
          value={availableServices.filter(
            (service) => !addedServiceIds.has(service.id),
          ).length}
          icon={<CheckCircle2 size={19} />}
        />

        <div className="col-span-2 sm:col-span-1">
          <SummaryCard
            title="Categories"
            value={categories.length}
            icon={<Tag size={19} />}
          />
        </div>
      </div>

      {/* Add New Service */}
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="flex items-center gap-3 border-b bg-muted/30 p-4 sm:p-5">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Plus size={20} />
          </div>

          <div>
            <h2 className="font-semibold">Add New Service</h2>
            <p className="text-xs text-muted-foreground">
              Select a service and set your price.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleAddService}
          className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5"
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
              className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
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

            {availableServices.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No services are available right now.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Your Price (BDT)
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ৳
              </span>

              <input
                id="price"
                type="number"
                min="1"
                step="0.01"
                required
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Enter your service price"
                className="h-11 w-full rounded-md border bg-background pl-8 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSaving || availableServices.length === 0}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Plus size={17} />
              {addMutation.isPending ? "Adding..." : "Add Service"}
            </button>
          </div>
        </form>
      </section>

      {/* My Services */}
      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">My Added Services</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your service prices and details.
            </p>
          </div>

          <div className="w-fit rounded-lg border bg-card px-3 py-2">
            <p className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                {myServices.length}
              </span>
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 rounded-xl border bg-card p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by service, category or description..."
                className="h-11 w-full rounded-md border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              aria-label="Filter by category"
              className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary lg:w-[200px]"
            >
              <option value="ALL">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
              aria-label="Sort services"
              className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary lg:w-[200px]"
            >
              <option value="DEFAULT">Default Sorting</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="NAME">Name: A to Z</option>
            </select>

            {/* Reset */}
            <button
              type="button"
              onClick={resetFilters}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition hover:bg-muted lg:w-auto"
            >
              <X size={16} />
              Reset
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredServices.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {myServices.length}
              </span>{" "}
              services
            </p>

            <p className="text-xs text-muted-foreground">
              Search, filter and sort your services
            </p>
          </div>
        </div>

        {/* Service List */}
        {filteredServices.length === 0 ? (
          <div className="rounded-xl border bg-card px-4 py-12 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <PackageOpen
                size={26}
                className="text-muted-foreground"
              />
            </div>

            <h3 className="font-semibold">
              {myServices.length === 0
                ? "No Services Added"
                : "No Matching Services"}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {myServices.length === 0
                ? "Add your first service using the form above."
                : "Try changing your search keyword or filters."}
            </p>

            {myServices.length > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredServices.map((item) => {
              const currentPrice = Number(
                item.price ?? item.service.basePrice,
              );

              return (
                <article
                  key={item.id}
                  className="flex min-w-0 flex-col justify-between gap-5 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md sm:p-5"
                >
                  {/* Service Information */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words text-lg font-semibold">
                          {item.service.name}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            <Tag size={13} />
                            {item.service.category?.name ??
                              "Uncategorized"}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 rounded-lg bg-primary/10 p-2.5 text-primary">
                        <BriefcaseBusiness size={21} />
                      </div>
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {item.service.description ??
                        "No description available."}
                    </p>
                  </div>

                  {/* Edit Price */}
                  {editingId === item.id ? (
                    <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                      <label
                        htmlFor={`price-${item.id}`}
                        className="text-sm font-medium"
                      >
                        Update Price (BDT)
                      </label>

                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          ৳
                        </span>

                        <input
                          id={`price-${item.id}`}
                          type="number"
                          min="1"
                          step="0.01"
                          value={editPrice}
                          onChange={(event) =>
                            setEditPrice(event.target.value)
                          }
                          className="h-10 w-full rounded-md border bg-background pl-8 pr-3 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => handleUpdate(item.id)}
                          className="flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
                        >
                          {updateMutation.isPending
                            ? "Saving..."
                            : "Save Changes"}
                        </button>

                        <button
                          type="button"
                          disabled={updateMutation.isPending}
                          onClick={() => {
                            setEditingId(null);
                            setEditPrice("");
                          }}
                          className="h-10 rounded-md border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Your Service Price
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xl font-bold">
                          <DollarSign
                            size={19}
                            className="text-primary"
                          />
                          BDT {currentPrice.toLocaleString()}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:flex">
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => {
                            setEditingId(item.id);
                            setEditPrice(String(currentPrice));
                          }}
                          className="flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => handleRemove(item.id)}
                          className="flex h-10 items-center justify-center gap-2 rounded-md border border-red-500/40 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

// Reusable Summary Card
function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground sm:text-sm">
          {title}
        </p>

        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}