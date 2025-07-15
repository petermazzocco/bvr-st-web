import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResult<TData>>,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: string) => void;
  },
) {
  return useMutation({
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const response = await mutationFn(variables);

      if (!response.success) {
        throw new Error(response.error || "Operation failed");
      }

      // Ensure data exists when success is true
      if (response.data === undefined) {
        throw new Error("No data returned from successful operation");
      }

      return response.data;
    },
    onSuccess: options?.onSuccess,
    onError: (error: Error) => {
      options?.onError?.(error.message);
    },
  });
}
