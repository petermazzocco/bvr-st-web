"use client";

import { ErrorCard } from "@/components/cards/error-card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ErrorCard
        error={{
          status: 404,
          message: "Page Not Found",
          details:
            "The requested page could not be found. Please check the URL or try again later.  ",
        }}
      />
    </div>
  );
}
