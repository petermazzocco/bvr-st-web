"use client";

import { ErrorCard } from "@/components/cards/error-card";
import { Suspense } from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorCard
          error={{
            status: 404,
            message: "Page Not Found",
            details:
              "The requested page could not be found. Please check the URL or try again later.  ",
          }}
        />
      </Suspense>
    </div>
  );
}
