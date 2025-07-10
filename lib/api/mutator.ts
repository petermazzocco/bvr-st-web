// lib/api/mutator.ts
export const customFetch = <T>(
  url: string,
  options: RequestInit & { data?: any } = {},
): Promise<T> => {
  const { data, ...init } = options;

  // Get auth token from localStorage or your auth store
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

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

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

  return fetch(`${baseUrl}${url}`, config).then(async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`,
      );
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return {} as T;

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  });
};
