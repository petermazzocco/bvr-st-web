"use client";

import { ErrorCard } from "@/components/cards/error-card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ErrorCard
        error={{
          status: 500,
          message: "An error occurred",
          details: "An unexpected error occurred. Please try again later.",
        }}
      />
    </div>
  );
}
