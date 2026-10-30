
"use client";

import { useState } from "react";
import {
  useMyEstimates,
  useMyBookings,
  useCreateEstimate,
} from "@/hooks/provider.hook";
import type { Estimate } from "@/types/estimate.type";
import type { Booking } from "@/types/booking.type";
import type { CreateEstimatePayload } from "@/types/estimate.type";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

const initialItem: FormItem = {
  description: "",
  quantity: 1,
  unitPrice: 0,
};

export default function ProviderMyEstimatesPage() {
  const [bookingId, setBookingId] = useState("");
  const [items, setItems] = useState<FormItem[]>([{ ...initialItem }]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const estimatesQuery = useMyEstimates();
  const bookingsQuery = useMyBookings();
  const createMutation = useCreateEstimate();

  const estimates: Estimate[] = estimatesQuery.data?.data ?? [];
  const bookings: Booking[] = bookingsQuery.data?.data ?? [];

  const existingBookingIds = new Set(
    estimates.map((estimate) => estimate.bookingId),
  );

  const availableBookings = bookings.filter(
    (booking) =>
      booking.status !== "CANCELLED" &&
      booking.status !== "COMPLETED" &&
      !existingBookingIds.has(booking.id),
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const total = subtotal + tax - discount;

  const updateItem = (
    index: number,
    field: keyof FormItem,
    value: string,
  ) => {
    setItems((previous) =>
      previous.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "description" ? value : Number(value),
            }
          : item,
      ),
    );
  };

  const resetForm = () => {
    setBookingId("");
    setItems([{ ...initialItem }]);
    setTax(0);
    setDiscount(0);
    setNotes("");
    setExpiresAt("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bookingId) {
      toast.add({
        title: "Booking required",
        description: "Please select a booking.",
        type: "error",
      });
      return;
    }

    if (
      items.some(
        (item) =>
          !item.description.trim() ||
          item.description.trim().length < 2 ||
          item.quantity <= 0 ||
          item.unitPrice <= 0,
      )
    ) {
      toast.add({
        title: "Invalid items",
        description:
          "Enter a valid description, quantity and unit price for every item.",
        type: "error",
      });
      return;
    }

    if (tax < 0 || discount < 0 || discount > subtotal + tax) {
      toast.add({
        title: "Invalid amount",
        description: "Check the tax and discount amounts.",
        type: "error",
      });
      return;
    }

    if (expiresAt && new Date(expiresAt) <= new Date()) {
      toast.add({
        title: "Invalid expiration",
        description: "Expiration must be a future date.",
        type: "error",
      });
      return;
    }

    const payload: CreateEstimatePayload = {
      bookingId,
      tax,
      discount,
      notes: notes.trim() || undefined,
      expiresAt: expiresAt
        ? new Date(expiresAt).toISOString()
        : undefined,
      items: items.map((item) => ({
        description: item.description.trim(),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.add({
          title: "Success",
          description: "Estimate created successfully.",
          type: "success",
        });
        resetForm();
      },
      onError: () => {
        toast.add({
          title: "Error",
          description:
            "Failed to create estimate. Check the booking and try again.",
          type: "error",
        });
      },
    });
  };

  if (estimatesQuery.isLoading || bookingsQuery.isLoading) {
    return <div className="p-6">Loading estimates...</div>;
  }

  if (estimatesQuery.isError || bookingsQuery.isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load estimates or bookings. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Estimates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create and manage customer service estimates.
        </p>
      </div>

      {/* Create Estimate Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg border p-5"
      >
        <h2 className="text-lg font-semibold">Create New Estimate</h2>

        <div className="space-y-2">
          <label htmlFor="booking" className="text-sm font-medium">
            Select Booking
          </label>

          <select
            id="booking"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            required
            className="w-full rounded-md border bg-background p-2"
          >
            <option value="">Select a booking</option>

            {availableBookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                {booking.customer?.name ?? "Customer"} —{" "}
                {booking.serviceRequest?.service?.name ?? "Service"} (
                {booking.id.slice(0, 8)})
              </option>
            ))}
          </select>

          {availableBookings.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No eligible bookings available for a new estimate.
            </p>
          )}
        </div>

        {/* Estimate Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold">Estimate Items</h3>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setItems((previous) => [
                  ...previous,
                  { ...initialItem },
                ])
              }
            >
              Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className="space-y-3 rounded-md border p-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  Item {index + 1}
                </h4>

                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setItems((previous) =>
                        previous.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-2 md:col-span-1">
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="text-sm">Description</label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    placeholder="e.g. AC cleaning"
                    required
                    minLength={2}
                    maxLength={500}
                  />
                </div>

                <div className="space-y-2">
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="text-sm">Quantity</label>
                  <Input
                    type="number"
                    min="0.01"
                    step="any"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="text-sm">Unit Price (৳)</label>
                  <Input
                    type="number"
                    min="0.01"
                    step="any"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(index, "unitPrice", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <p className="text-right text-sm font-medium">
                Item Total: ৳
                {(item.quantity * item.unitPrice).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Tax and Discount */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="tax" className="text-sm font-medium">
              Tax (৳)
            </label>
            <Input
              id="tax"
              type="number"
              min="0"
              step="any"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="discount" className="text-sm font-medium">
              Discount (৳)
            </label>
            <Input
              id="discount"
              type="number"
              min="0"
              step="any"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Additional information..."
            className="w-full rounded-md border bg-background p-3"
          />
        </div>

        {/* Expiration */}
        <div className="space-y-2">
          <label htmlFor="expiresAt" className="text-sm font-medium">
            Expiration Date (Optional)
          </label>
          <Input
            id="expiresAt"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        {/* Total */}
        <div className="space-y-2 rounded-lg bg-muted p-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>৳{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>৳{tax.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Discount</span>
            <span>- ৳{discount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between border-t pt-2 font-bold">
            <span>Total</span>
            <span>৳{total.toLocaleString()}</span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={createMutation.isPending || availableBookings.length === 0}
        >
          {createMutation.isPending ? "Creating..." : "Create Estimate"}
        </Button>
      </form>

      {/* Existing Estimates */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Estimate History</h2>

        {estimates.length === 0 ? (
          <div className="rounded-lg border p-6 text-center text-muted-foreground">
            No estimates found.
          </div>
        ) : (
          estimates.map((estimate) => (
            <div key={estimate.id} className="space-y-3 rounded-lg border p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">
                    {estimate.booking?.serviceRequest?.service?.name ??
                      "Service Estimate"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Booking: {estimate.bookingId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Customer: {estimate.booking?.customer?.name ?? "Not available"}
                  </p>
                </div>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {estimate.status}
                </span>
              </div>

              <div className="flex flex-wrap justify-between gap-2 border-t pt-3">
                <span className="text-sm text-muted-foreground">
                  {estimate.items.length} item(s)
                </span>

                <span className="font-semibold">
                  Total: ৳{Number(estimate.total).toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                Created: {new Date(estimate.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
