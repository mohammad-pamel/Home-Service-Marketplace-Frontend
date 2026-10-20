
"use client";

import { useMemo, useState } from "react";
import { useGetAllServiceRequests } from "@/hooks/admin.hook";
import type { ServiceRequestStatus } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceRequestStatus | "ALL">("ALL");

  const requests = data?.data ?? [];

  const filteredRequests = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !searchTerm ||
        request.title.toLowerCase().includes(searchTerm) ||
        request.customer.name.toLowerCase().includes(searchTerm) ||
        request.customer.email.toLowerCase().includes(searchTerm) ||
        request.service.name.toLowerCase().includes(searchTerm) ||
        request.location.address.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  if (isLoading) {
    return <div className="p-6">Loading service requests...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load service requests. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 items-center sm:flex-row">
        <Input
          placeholder="Search customer, service, or title..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:max-w-sm"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as ServiceRequestStatus | "ALL",
            )
          }
          className="h-8 rounded-md border bg-background text-sm"
          aria-label="Filter by service request status"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status === "ALL" ? "All Statuses" : status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-muted-foreground">
        Total requests: {filteredRequests.length}
      </div>

      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Preferred Date</TableHead>
              <TableHead>Preferred Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  No service requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="min-w-40">
                      <p className="font-medium">{request.title}</p>
                      <p className="max-w-52 truncate text-xs text-muted-foreground">
                        {request.description}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="min-w-36">
                      <p>{request.customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.customer.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {request.customer.phone || "No phone"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="min-w-32">
                      <p>{request.service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.service.category.name}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="min-w-40">
                      <p>{request.location.area || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.location.address}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {request.location.city || ""}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    {formatDate(request.preferredDate)}
                  </TableCell>

                  <TableCell>
                    {request.preferredTime || "Not specified"}
                  </TableCell>

                  <TableCell>
                    <span className="whitespace-nowrap rounded-md border px-2 py-1 text-xs">
                      {request.status.replaceAll("_", " ")}
                    </span>
                  </TableCell>

                  <TableCell>
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
                  </TableCell>

                  <TableCell>
                    {request.booking ? (
                      <div>
                        <p>{request.booking.status}</p>
                        <p className="text-xs text-muted-foreground">
                          ৳{request.booking.totalAmount}
                        </p>
                      </div>
                    ) : (
                      "No booking"
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {formatDate(request.createdAt)}
                  </TableCell>
                  <TableCell>
  <Button
    size="sm"
    // variant="outline"
    onClick={() =>
      router.push(`/admin/all-service-requests/${request.id}`)
    }
  >
    View Details
  </Button>
</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
