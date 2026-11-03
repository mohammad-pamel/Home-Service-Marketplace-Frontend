
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Wrench,
  Clock,
  Filter,
  X,
} from "lucide-react";

// import Header from "@/components/layout/Header";
import {
  usePublicCategories,
  usePublicServices,
} from "@/hooks/public.hook";
import Header from "@/components/layout/public/Header";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number | string;
  durationMinutes: number | null;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
  };
}

interface PaginatedData<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function getResponseData<T>(response: unknown): T | null {
  if (!response || typeof response !== "object") return null;

  const result = response as { data?: unknown };

  if (result.data === undefined) return null;

  return result.data as T;
}

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);

  // Read category from homepage link: /services?category=ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("category");

    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, []);

  const categoriesQuery = usePublicCategories();

  const servicesQuery = usePublicServices({
    page,
    limit: 12,
    search: search.trim() || undefined,
    status: "active",
  });

  const categories =
    getResponseData<Category[]>(categoriesQuery.data) ?? [];

  const serviceResult =
    getResponseData<PaginatedData<Service>>(servicesQuery.data);

  const services = serviceResult?.data ?? [];
  const meta = serviceResult?.meta;

  // Category filtering is client-side because the backend
  // service query does not currently support categoryId.
  const filteredServices = useMemo(() => {
    if (selectedCategory === "all") return services;

    return services.filter(
      (service) => service.category?.id === selectedCategory,
    );
  }, [services, selectedCategory]);

  const totalPages = meta?.totalPages ?? 1;

  function changeCategory(categoryId: string) {
    setSelectedCategory(categoryId);
    setPage(1);
  }

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* <Header /> */}

      {/* Page Heading */}
      <section className="bg-green-50 py-14">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="font-semibold text-green-600">
            OUR SERVICES
          </p>

          <h1 className="mt-3 text-3xl font-extrabold md:text-5xl">
            Find the Right Service for Your Home
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-600">
            Explore our available home services and choose
            the right solution for your needs.
          </p>

          <div className="mt-7 flex max-w-2xl items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">
            <Search className="shrink-0 text-green-600" size={21} />

            <input
              type="search"
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="Search services by name or description..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => changeSearch("")}
                className="text-gray-400 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">

          {/* Category Sidebar */}
          <aside>
            <div className="rounded-2xl border p-5">
              <div className="flex items-center gap-2">
                <Filter size={19} className="text-green-600" />
                <h2 className="font-bold">Categories</h2>
              </div>

              {categoriesQuery.isLoading ? (
                <div className="mt-5 space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={index}
                      className="h-9 animate-pulse rounded-lg bg-gray-100"
                    />
                  ))}
                </div>
              ) : categoriesQuery.isError ? (
                <p className="mt-4 text-sm text-red-500">
                  Unable to load categories.
                </p>
              ) : (
                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={() => changeCategory("all")}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                      selectedCategory === "all"
                        ? "bg-green-600 text-white"
                        : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    All Categories
                  </button>

                  {categories
                    .filter((category) => category.isActive)
                    .map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => changeCategory(category.id)}
                        className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                          selectedCategory === category.id
                            ? "bg-green-600 text-white"
                            : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </aside>

          {/* Services */}
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">
                  Available Services
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {meta
                    ? `${meta.total} services found`
                    : "Explore our services"}
                </p>
              </div>

              {selectedCategory !== "all" && (
                <button
                  type="button"
                  onClick={() => changeCategory("all")}
                  className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
                >
                  <X size={15} />
                  Clear category
                </button>
              )}
            </div>

            {servicesQuery.isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    className="h-72 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}
              </div>
            ) : servicesQuery.isError ? (
              <div className="rounded-xl border border-red-200 p-8 text-center">
                <p className="font-semibold text-red-600">
                  Unable to load services.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Please try again.
                </p>

                <button
                  type="button"
                  onClick={() => servicesQuery.refetch()}
                  className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Try Again
                </button>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="rounded-xl border p-10 text-center">
                <Wrench
                  size={40}
                  className="mx-auto text-green-500"
                />

                <h3 className="mt-4 text-lg font-bold">
                  No Services Found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try another search or select a different category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    changeSearch("");
                    changeCategory("all");
                  }}
                  className="mt-5 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredServices.map((service) => (
                    <article
                      key={service.id}
                      className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex h-40 items-center justify-center bg-green-50">
                        <Wrench
                          size={45}
                          className="text-green-600"
                        />
                      </div>

                      <div className="p-5">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          {service.category?.name ?? "Home Service"}
                        </span>

                        <h3 className="mt-4 text-lg font-bold">
                          {service.name}
                        </h3>

                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-gray-500">
                          {service.description ||
                            "Professional home service for your needs."}
                        </p>

                        {service.durationMinutes && (
                          <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                            <Clock size={15} />
                            {service.durationMinutes} minutes
                          </p>
                        )}

                        <div className="mt-4 border-t pt-4">
                          <p className="text-xs text-gray-500">
                            Starting from
                          </p>

                          <p className="mt-1 text-xl font-bold text-green-700">
                            ৳{Number(service.basePrice).toLocaleString("en-BD")}
                          </p>
                        </div>

                        <Link
                          href={`/services/${service.id}`}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                          View Details
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {selectedCategory === "all" && totalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((current) => current - 1)}
                      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowLeft size={16} />
                      Previous
                    </button>

                    <span className="text-sm font-medium text-gray-600">
                      Page {meta?.page ?? page} of {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage((current) => current + 1)}
                      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {selectedCategory !== "all" && (
                  <p className="mt-8 text-center text-xs text-gray-500">
                    Showing matching services on the current page.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
