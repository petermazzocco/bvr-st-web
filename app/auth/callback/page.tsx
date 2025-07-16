"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CallbackTestContent() {
  const searchParams = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const allParams = Object.fromEntries(searchParams.entries());

    const debug = `
URL: ${window.location.href}
Token: ${token}
Error: ${error}
All Params: ${JSON.stringify(allParams, null, 2)}
Token Length: ${token?.length || 0}
Token First 20 chars: ${token?.substring(0, 20) || "none"}
    `;

    setDebugInfo(debug);
    console.log("OAuth Callback Debug:", debug);
  }, [searchParams]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">OAuth Callback Debug</h1>
      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm">
        {debugInfo}
      </pre>
      <div className="mt-4">
        <button
          onClick={() => (window.location.href = "/account")}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Go to Account (without setting token)
        </button>
        <button
          onClick={() => (window.location.href = "/signin")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
}

export default function CallbackTestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackTestContent />
    </Suspense>
  );
}
