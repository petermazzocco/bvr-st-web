// orval.config.ts
import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "http://localhost:8080/swagger/doc.json",
    },
    output: {
      mode: "tags-split",
      target: "lib/api/generated",
      schemas: "lib/api/model",
      client: "react-query",
      httpClient: "fetch",
      prettier: true,
      override: {
        mutator: {
          path: "lib/api/mutator.ts",
          name: "customFetch",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});

// lib/api/mutator.ts
export const customFetch = <T>(
  url: string,
  options: RequestInit & { data?: any } = {},
): Promise<T> => {
  const { data, ...init } = options;

  // Get auth token from your auth store/context
  const token = localStorage.getItem("auth_token"); // or however you store it

  const config: RequestInit = {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...init.headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${url}`,
    config,
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
};
