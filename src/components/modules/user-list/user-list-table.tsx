
"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  ArrowUpDown,
  Users,
  Filter,
  X,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetAllUsers } from "@/hooks/admin.hook";
import { User } from "@/types";

type SortField = "name" | "email" | "role" | "status";
type SortOrder = "asc" | "desc";

export default function UserListTable() {
  const { data, isLoading, isError } = useGetAllUsers();

  const users: User[] = data?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search Filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();

      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search) ||
          user.phone?.toLowerCase().includes(search),
      );
    }

    // Role Filter
    if (roleFilter !== "ALL") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Status Filter
    if (statusFilter !== "ALL") {
      result = result.filter((user) => user.status === statusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      const first = String(a[sortField] ?? "").toLowerCase();
      const second = String(b[sortField] ?? "").toLowerCase();

      const comparison = first.localeCompare(second);

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [users, searchTerm, roleFilter, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // const resetFilters = () => {
  //   setSearchTerm("");
  //   setRoleFilter("ALL");
  //   setStatusFilter("ALL");
  //   setSortField("name");
  //   setSortOrder("asc");
  // };

  const getStatusStyle = (status: string) => {
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
  };

  const getRoleStyle = (role: string) => {
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
  };

  if (isLoading) {
    return (
      <div className="space-y-4 rounded-xl border p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-10 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded bg-muted" />
        <p className="text-sm text-muted-foreground">
          Loading users...
        </p>
      </div>
    );
  }

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
          <p className="text-xs text-muted-foreground">
            Total Users
          </p>
          <p className="text-xl font-bold">{users.length}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 rounded-xl border p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-full rounded-lg border bg-background pr-4 pl-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-11 rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="PROVIDER">Provider</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLOCKED">Blocked</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          {/* Reset */}
          {/* <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm transition hover:bg-muted"
          >
            <X size={16} />
            Reset
          </button> */}
        </div>

        {/* Filter Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter size={15} />
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredUsers.length}
            </span>{" "}
            of {users.length} users
          </div>

          <p className="text-xs text-muted-foreground">
            Search, filter or sort users
          </p>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>
              A list of all registered users.
            </TableCaption>

            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-[180px]">
                  <button
                    type="button"
                    onClick={() => handleSort("name")}
                    className="inline-flex items-center gap-2 font-semibold"
                  >
                    Name
                    <ArrowUpDown size={14} />
                  </button>
                </TableHead>

                <TableHead className="min-w-[210px]">
                  <button
                    type="button"
                    onClick={() => handleSort("email")}
                    className="inline-flex items-center gap-2 font-semibold"
                  >
                    Email
                    <ArrowUpDown size={14} />
                  </button>
                </TableHead>

                <TableHead className="min-w-[130px]">
                  Phone
                </TableHead>

                <TableHead>
                  <button
                    type="button"
                    onClick={() => handleSort("status")}
                    className="inline-flex items-center gap-2 font-semibold"
                  >
                    Status
                    <ArrowUpDown size={14} />
                  </button>
                </TableHead>

                <TableHead>
                  <button
                    type="button"
                    onClick={() => handleSort("role")}
                    className="inline-flex items-center gap-2 font-semibold"
                  >
                    Role
                    <ArrowUpDown size={14} />
                  </button>
                </TableHead>

                <TableHead className="min-w-[130px]">
                  Auth Provider
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Users
                        size={28}
                        className="text-muted-foreground"
                      />

                      <p className="font-medium">
                        No users found
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: User) => (
                  <TableRow
                    key={user.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="font-medium">
                      {user.name || "---"}
                    </TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      {user.phone || "---"}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getRoleStyle(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </TableCell>

                    <TableCell>
                      {user.authProvider || "---"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
