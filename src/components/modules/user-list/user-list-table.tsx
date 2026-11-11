
"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Filter, Search, Users, X } from "lucide-react";

import { useGetAllUsers } from "@/hooks/admin.hook";
import type { User } from "@/types";

import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SortField = "name" | "email" | "role" | "status";
type SortOrder = "asc" | "desc";

export default function UserListTable() {
  const { data, isLoading, isError } = useGetAllUsers();

  const users: User[] = data?.data ?? [];

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Search, filter and sorting
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();

      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search) ||
          user.phone?.toLowerCase().includes(search),
      );
    }

    if (roleFilter !== "ALL") {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((user) => user.status === statusFilter);
    }

    result.sort((a, b) => {
      const first = String(a[sortField] ?? "").toLowerCase();
      const second = String(b[sortField] ?? "").toLowerCase();

      const comparison = first.localeCompare(second);

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [users, searchTerm, roleFilter, statusFilter, sortField, sortOrder]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  function resetFilters() {
    setSearchTerm("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setSortField("name");
    setSortOrder("asc");
  }

  const hasActiveFilters =
    searchTerm !== "" ||
    roleFilter !== "ALL" ||
    statusFilter !== "ALL";

  function getStatusStyle(status: string) {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

      case "INACTIVE":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

      case "BLOCKED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

      case "SUSPENDED":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

      default:
        return "bg-muted text-muted-foreground";
    }
  }

  function getRoleStyle(role: string) {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";

      case "PROVIDER":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

      case "CUSTOMER":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";

      default:
        return "bg-muted text-muted-foreground";
    }
  }

  // Reusable DataTable columns
  const columns: DataTableColumn<User>[] = [
    {
      key: "name",
      header: (
        <button
          type="button"
          onClick={() => handleSort("name")}
          className="inline-flex items-center gap-2 font-semibold"
        >
          Name
          <ArrowUpDown size={14} />
        </button>
      ),
      className: "min-w-[180px]",
      cell: (user) => (
        <span className="font-medium">{user.name || "---"}</span>
      ),
    },
    {
      key: "email",
      header: (
        <button
          type="button"
          onClick={() => handleSort("email")}
          className="inline-flex items-center gap-2 font-semibold"
        >
          Email
          <ArrowUpDown size={14} />
        </button>
      ),
      className: "min-w-[210px]",
      cell: (user) => user.email,
    },
    {
      key: "phone",
      header: "Phone",
      className: "min-w-[130px]",
      cell: (user) => user.phone || "---",
    },
    {
      key: "status",
      header: (
        <button
          type="button"
          onClick={() => handleSort("status")}
          className="inline-flex items-center gap-2 font-semibold"
        >
          Status
          <ArrowUpDown size={14} />
        </button>
      ),
      cell: (user) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(user.status)}`}
        >
          {user.status}
        </span>
      ),
    },
    {
      key: "role",
      header: (
        <button
          type="button"
          onClick={() => handleSort("role")}
          className="inline-flex items-center gap-2 font-semibold"
        >
          Role
          <ArrowUpDown size={14} />
        </button>
      ),
      cell: (user) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getRoleStyle(user.role)}`}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: "authProvider",
      header: "Auth Provider",
      className: "min-w-[130px]",
      cell: (user) => user.authProvider || "---",
    },
  ];

  if (isError) {
    return (
      <div className="rounded-xl border p-6 text-center">
        <p className="font-semibold text-red-600">
          Failed to load users.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Users className="text-primary" size={22} />

            <h1 className="text-2xl font-bold tracking-tight">
              User Management
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor all registered users.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/30 px-4 py-2">
          <p className="text-xs text-muted-foreground">Total Users</p>
          <p className="text-xl font-bold">{users.length}</p>
        </div>
      </div>

      {/* Reusable DataTable */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        skeletonRows={6}
        caption="A list of all registered users."
        emptyTitle={
          users.length === 0 ? "No Users Yet" : "No Users Found"
        }
        emptyDescription={
          users.length === 0
            ? "Registered users will appear here."
            : "Try changing your search or filters."
        }
        emptyAction={
          hasActiveFilters ? (
            <Button
              type="button"
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
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {/* Search */}
              <div className="relative lg:col-span-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="h-11 pl-10"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="h-11 rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary"
                aria-label="Filter users by role"
              >
                <option value="ALL">All Roles</option>
                <option value="CUSTOMER">Customer</option>
                <option value="PROVIDER">Provider</option>
                <option value="ADMIN">Admin</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-11 rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary"
                aria-label="Filter users by status"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="BLOCKED">Blocked</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            {/* Filter Summary */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter size={15} />

                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredUsers.length}
                </span>{" "}
                of {users.length} users
              </div>

              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">
                  Search, filter or sort users
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                >
                  <X size={15} />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
