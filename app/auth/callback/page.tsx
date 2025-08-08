"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");
    const redirectUrl = searchParams.get("redirect");

    if (errorParam) {
      console.log("❌ Error parameter found:", errorParam);
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
      router.push(`/signin?error=${encodeURIComponent(errorMessage)}`);
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
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          return data;
        })
        .then((data) => {
          if (data.success) {
            router.push(data.redirectUrl);
          } else {
            console.error("❌ Token setting failed:", data.error);
            router.push(`/signin?error=${encodeURIComponent(data.error || "Failed to authenticate")}`);
          }
        })
        .catch((err) => {
          console.error("💥 Authentication error:", err);
          router.push(`/signin?error=${encodeURIComponent("Failed to process authentication: " + err.message)}`);
        });
    } else {
      console.error("❌ No token received in callback");
      router.push(`/signin?error=${encodeURIComponent("No authentication token received")}`);
    }
  }, [searchParams, router]);


  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="flex space-x-2 justify-center items-center h-fit">
          <span className="sr-only">Loading...</span>
          <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
        </div>
        <p className="mt-2 text-muted-foreground text-xs">
          Processing authentication...
        </p>
      </div>
    </div>
  );
}
