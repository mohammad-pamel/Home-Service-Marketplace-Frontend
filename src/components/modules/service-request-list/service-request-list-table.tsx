
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

import { useGetAllServiceRequests } from "@/hooks/admin.hook";
import type { ServiceRequestStatus } from "@/types";

import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const statusOptions: (ServiceRequestStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "MATCHED",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
  "IN_PROGRESS",
  "COMPLETED",
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "title-desc", label: "Title: Z to A" },
  { value: "preferred-asc", label: "Preferred Date: Earliest" },
  { value: "preferred-desc", label: "Preferred Date: Latest" },
] as const;

type SortOption = (typeof sortOptions)[number]["value"];

const PAGE_SIZE = 10;

function formatDate(date: string | null) {
  if (!date) return "Not specified";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ServiceRequestListTable() {
  const { data, isLoading, isError } = useGetAllServiceRequests();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const appliedSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(appliedSearch);

  useEffect(() => {
    setSearchInput(appliedSearch);
  }, [appliedSearch]);

  const statusParam = searchParams.get("status") ?? "ALL";

  const statusFilter = statusOptions.includes(
    statusParam as ServiceRequestStatus | "ALL",
  )
    ? (statusParam as ServiceRequestStatus | "ALL")
    : "ALL";

  const sortParam = searchParams.get("sort") ?? "newest";

  const sortBy = sortOptions.some(
    (option) => option.value === sortParam,
  )
    ? (sortParam as SortOption)
    : "newest";

  const requestedPage = Number(searchParams.get("page") ?? "1");

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const requests = data?.data ?? [];

  // URL update
  function updateURL(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (
      !value ||
      value === "ALL" ||
      (key === "sort" && value === "newest")
    ) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key !== "page") {
      params.delete("page");
    }

    const queryString = params.toString();

    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname,
      { scroll: false },
    );
  }

  function handleSearch() {
    updateURL("search", searchInput.trim());
  }

  function resetFilters() {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  }

  // Search and filter
  const filteredRequests = useMemo(() => {
    const searchTerm = searchInput.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !searchTerm ||
        request.title.toLowerCase().includes(searchTerm) ||
        request.customer.name.toLowerCase().includes(searchTerm) ||
        request.customer.email.toLowerCase().includes(searchTerm) ||
        request.service.name.toLowerCase().includes(searchTerm) ||
        request.location.address.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" ||
        request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchInput, statusFilter]);

  // Sorting
  const sortedRequests = useMemo(() => {
    const sorted = [...filteredRequests];

    sorted.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );

        case "title-asc":
          return a.title.localeCompare(b.title);

        case "title-desc":
          return b.title.localeCompare(a.title);

        case "preferred-asc":
          if (!a.preferredDate) return 1;
          if (!b.preferredDate) return -1;

          return (
            new Date(a.preferredDate).getTime() -
            new Date(b.preferredDate).getTime()
          );

        case "preferred-desc":
          if (!a.preferredDate) return 1;
          if (!b.preferredDate) return -1;

          return (
            new Date(b.preferredDate).getTime() -
            new Date(a.preferredDate).getTime()
          );

        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
      }
    });

    return sorted;
  }, [filteredRequests, sortBy]);

  // Pagination
  const totalRequests = sortedRequests.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalRequests / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return sortedRequests.slice(
      startIndex,
      startIndex + PAGE_SIZE,
    );
  }, [sortedRequests, currentPage]);

  const startItem =
    totalRequests === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(
    currentPage * PAGE_SIZE,
    totalRequests,
  );

  // Table columns
  const columns: DataTableColumn<(typeof requests)[number]>[] = [
    {
      key: "request",
      header: "Request",
      cell: (request) => (
        <div className="min-w-40">
          <p className="font-medium">{request.title}</p>
          <p className="max-w-52 truncate text-xs text-muted-foreground">
            {request.description}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (request) => (
        <div className="min-w-36">
          <p>{request.customer.name}</p>
          <p className="text-xs text-muted-foreground">
            {request.customer.email}
          </p>
          <p className="text-xs text-muted-foreground">
            {request.customer.phone || "No phone"}
          </p>
        </div>
      ),
    },
    {
      key: "service",
      header: "Service",
      cell: (request) => (
        <div className="min-w-32">
          <p>{request.service.name}</p>
          <p className="text-xs text-muted-foreground">
            {request.service.category.name}
          </p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      cell: (request) => (
        <div className="min-w-40">
          <p>{request.location.area || "N/A"}</p>
          <p className="text-xs text-muted-foreground">
            {request.location.address}
          </p>
          <p className="text-xs text-muted-foreground">
            {request.location.city || ""}
          </p>
        </div>
      ),
    },
    {
      key: "preferredDate",
      header: "Preferred Date",
      cell: (request) => formatDate(request.preferredDate),
    },
    {
      key: "preferredTime",
      header: "Preferred Time",
      cell: (request) => request.preferredTime || "Not specified",
    },
    {
      key: "status",
      header: "Status",
      cell: (request) => (
        <span className="whitespace-nowrap rounded-md border px-2 py-1 text-xs">
          {request.status.replaceAll("_", " ")}
        </span>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      cell: (request) => (
        <div className="min-w-32">
          {request.assignments.length > 0 ? (
            request.assignments.map((assignment) => (
              <div key={assignment.id} className="mb-1">
                <p>{assignment.provider.name}</p>
                <p className="text-xs text-muted-foreground">
                  {assignment.status}
                </p>
              </div>
            ))
          ) : (
            <span className="text-muted-foreground">
              Not assigned
            </span>
          )}
        </div>
      ),
    },
    {
      key: "booking",
      header: "Booking",
      cell: (request) =>
        request.booking ? (
          <div>
            <p>{request.booking.status}</p>
            <p className="text-xs text-muted-foreground">
              ৳{request.booking.totalAmount}
            </p>
          </div>
        ) : (
          "No booking"
        ),
    },
    {
      key: "createdAt",
      header: "Created At",
      cell: (request) => (
        <span className="whitespace-nowrap">
          {formatDate(request.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (request) => (
        <Button
          size="sm"
          onClick={() =>
            router.push(
              `/admin/all-service-requests/${request.id}`,
            )
          }
        >
          View Details
        </Button>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="rounded-lg border p-6 text-center text-red-500">
        Failed to load service requests. Please try again.
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={paginatedRequests}
      isLoading={isLoading}
      skeletonRows={6}
      emptyTitle={
        requests.length === 0
          ? "No Service Requests Yet"
          : "No Matching Requests Found"
      }
      emptyDescription={
        requests.length === 0
          ? "Customer service requests will appear here when they are submitted."
          : "We couldn't find any service requests matching your search or selected filters. Try changing your search or filters."
      }
      emptyAction={
        requests.length > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
          >
            <X size={16} />
            Clear Search & Filters
          </Button>
        ) : undefined
      }
      toolbar={
        <div className="space-y-4 rounded-xl border p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {/* Search */}
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  placeholder="Search customer, service, title or location..."
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="h-11 w-full pl-10"
                />
              </div>

              <Button
                type="button"
                onClick={handleSearch}
                className="h-11 w-full sm:w-auto"
              >
                <Search size={16} />
                Search
              </Button>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(event) =>
                updateURL("status", event.target.value)
              }
              className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
              aria-label="Filter by service request status"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL"
                    ? "All Statuses"
                    : status.replaceAll("_", " ")}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(event) =>
                updateURL("sort", event.target.value)
              }
              className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
              aria-label="Sort service requests"
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Result Count and Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {startItem}-{endItem}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {totalRequests}
              </span>{" "}
              filtered requests ({requests.length} total)
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFilters}
              disabled={
                !searchInput &&
                !appliedSearch &&
                statusFilter === "ALL" &&
                sortBy === "newest"
              }
            >
              <X size={16} />
              Reset Filters
            </Button>
          </div>
        </div>
      }
      pagination={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() =>
                updateURL("page", String(currentPage - 1))
              }
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() =>
                updateURL("page", String(currentPage + 1))
              }
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      }
    />
  );
}
