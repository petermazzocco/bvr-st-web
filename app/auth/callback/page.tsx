"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");
    const redirectUrl = searchParams.get("redirect");

    if (errorParam) {
      let errorMessage =
        "Something went wrong during authentication. Please try again.";

      switch (errorParam) {
        case "account_exists_with_password":
          errorMessage =
            "An account with this email already exists. Please sign in with your email and password instead.";
          break;
        case "database_error":
          errorMessage = "A database error occurred. Please try again later.";
          break;
        case "user_creation_failed":
          errorMessage = "Failed to create your account. Please try again.";
          break;
        case "token_generation_failed":
          errorMessage =
            "Failed to generate authentication token. Please try again.";
          break;
        default:
          errorMessage =
            "Something went wrong during authentication. Please try again.";
      }

      setError(errorMessage);
      return;
    }

    if (token) {
      // Call the route handler to set the cookie
      fetch("/api/auth/set-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          redirectUrl,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            router.push(data.redirectUrl);
          } else {
            setError(data.error || "Failed to authenticate");
          }
        })
        .catch((err) => {
          console.error("Authentication error:", err);
          setError("Failed to process authentication");
        });
    } else {
      setError("No authentication token received");
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-destructive/60 bg-destructive/10 p-6 text-center max-w-lg flex flex-col gap-4">
          <h1 className="text-md font-semibold text-destructive">
            An error occurred during authentication
          </h1>
          <p className="mt-2 text-destructive/80 text-xs">{error}</p>
          <Button className="w-full" asChild>
            <Link href="/signin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
}
