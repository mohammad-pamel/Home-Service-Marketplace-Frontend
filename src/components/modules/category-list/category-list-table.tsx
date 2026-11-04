
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ArrowUpDown,
  Tags,
  X,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useDeleteCategory,
  useGetAllCategories,
} from "@/hooks/admin.hook";

import { Category } from "@/types";
import { toast } from "@/components/ui/toast";

import CategoryCreateDialog from "./category-create-dialog";
import CategoryUpdateDialog from "./category-update-dialog";

type SortField = "name" | "slug";
type SortOrder = "asc" | "desc";

export default function CategoryListTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
  } = useGetAllCategories();

  const {
    mutate: remove,
    isPending: deletePending,
  } = useDeleteCategory();

  const categories: Category[] = data?.data || [];

  // Search, Filter and Sorting
  const filteredCategories = useMemo(() => {
    let result = [...categories];

    // Search
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();

      result = result.filter(
        (category) =>
          category.name?.toLowerCase().includes(search) ||
          category.slug?.toLowerCase().includes(search),
      );
    }

    // Status Filter
    if (statusFilter === "ACTIVE") {
      result = result.filter((category) => category.isActive);
    } else if (statusFilter === "INACTIVE") {
      result = result.filter((category) => !category.isActive);
    }

    // Sorting
    result.sort((a, b) => {
      const first = String(a[sortField] ?? "").toLowerCase();
      const second = String(b[sortField] ?? "").toLowerCase();

      const comparison = first.localeCompare(second);

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [categories, searchTerm, statusFilter, sortField, sortOrder]);

  // Sorting Handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((previous) =>
        previous === "asc" ? "desc" : "asc",
      );
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // // Reset Filters
  // const resetFilters = () => {
  //   setSearchTerm("");
  //   setStatusFilter("ALL");
  //   setSortField("name");
  //   setSortOrder("asc");
  // };

  // Delete Handler
  const handleDelete = (id: string) => {
    remove(id, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.add({
            title: "Server Failure",
            description: "Something went wrong. Please try again.",
            type: "error",
          });
          return;
        }

        toast.add({
          title: "Category Deleted",
          description: "Category removed successfully.",
          type: "success",
        });

        setConfirmDelete(null);
      },

      onError: (err) => {
        toast.add({
          title: "Delete Failed",
          description:
            err.message || "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-4 rounded-xl border p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-10 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded bg-muted" />
        <p className="text-sm text-muted-foreground">
          Loading categories...
        </p>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="rounded-xl border p-6 text-center">
        <p className="font-semibold text-red-600">
          Failed to load categories.
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
            <Tags size={22} className="text-primary" />

            <h1 className="text-2xl font-bold tracking-tight">
              Category Management
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage, search and organize service categories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-lg border bg-muted/30 px-4 py-2">
            <p className="text-xs text-muted-foreground">
              Total Categories
            </p>
            <p className="text-xl font-bold">
              {categories.length}
            </p>
          </div>

          <CategoryCreateDialog />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 rounded-xl border p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              type="search"
              placeholder="Search by category name or slug..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-11 pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          {/* Reset */}
          {/* <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={resetFilters}
          >
            <X size={16} />
            Reset
          </Button> */}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredCategories.length}
            </span>{" "}
            of {categories.length} categories
          </p>

          <p className="text-xs text-muted-foreground">
            Search, filter or sort categories
          </p>
        </div>
      </div>

      {/* Category Table */}
      <div className="overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>
              A list of all service categories.
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

                <TableHead className="min-w-[180px]">
                  <button
                    type="button"
                    onClick={() => handleSort("slug")}
                    className="inline-flex items-center gap-2 font-semibold"
                  >
                    Slug
                    <ArrowUpDown size={14} />
                  </button>
                </TableHead>

                <TableHead className="text-center">
                  Status
                </TableHead>

                <TableHead className="min-w-[180px] text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Tags
                        size={28}
                        className="text-muted-foreground"
                      />

                      <p className="font-medium">
                        No categories found
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category: Category) => (
                  <TableRow
                    key={category.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {category.slug}
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          category.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <CategoryUpdateDialog category={category} />

                        {confirmDelete === category.id ? (
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={deletePending}
                              onClick={() => setConfirmDelete(null)}
                            >
                              Cancel
                            </Button>

                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              disabled={deletePending}
                              onClick={() => handleDelete(category.id)}
                            >
                              {deletePending ? "Deleting..." : "Confirm"}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={deletePending}
                            onClick={() => setConfirmDelete(category.id)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        )}
                      </div>
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
