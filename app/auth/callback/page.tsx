"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get token or error from URL parameters (set by backend redirect)
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        if (error) {
          setStatus("error");
          let userMessage = "Authentication failed";

          switch (error) {
            case "account_exists_with_password":
              userMessage =
                "An account with this email already exists. Please sign in with your email and password instead.";
              break;
            case "user_creation_failed":
              userMessage = "Failed to create user account. Please try again.";
              break;
            case "token_generation_failed":
              userMessage = "Authentication failed. Please try again.";
              break;
            case "database_error":
              userMessage = "A system error occurred. Please try again later.";
              break;
            default:
              userMessage = `Authentication failed: ${error}`;
          }

          setMessage(userMessage);
          return;
        }

        if (!token) {
          setStatus("error");
          setMessage("No authentication token received");
          return;
        }

        // Store the token in cookies as authToken (not localStorage)
        document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // 7 days expiration

        // Debug: Log the token to make sure it's being stored
        console.log("Token stored in cookie:", token);
        console.log("Cookie set:", document.cookie);

        setStatus("success");
        setMessage("Authentication successful! Redirecting...");

        // Redirect to the account page immediately
        console.log("Redirecting to /account...");
        router.replace("/account");
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        setMessage(
          `Authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    };

    handleOAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-none">
        <CardContent className="p-6">
          <div className="text-center">
            {status === "loading" && (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Verifying Authentication
                </h2>
                <p className="text-gray-600">{message}</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center">
                <div className="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Authentication Successful!
                </h2>
                <p className="text-gray-600">{message}</p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center">
                <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Authentication Failed
                </h2>
                <p className="text-gray-600 mb-4">{message}</p>
                <Button
                  onClick={() => router.push("/signin")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
