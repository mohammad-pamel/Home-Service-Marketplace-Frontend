"use client";

import { Suspense } from "react";


export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[75vh] items-center justify-center">
          Loading payment details...
        </div>
      }
    >
      {/* <PaymentSuccessContent /> */}
      <PaymentSuccessPage></PaymentSuccessPage>
    </Suspense>
  );
}