// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { InfiniteData, UseInfiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { UserService } from "../requests/services.gen";
import * as Common from "./common";
export const useUserServiceGetApiV1AccountByIdOrdersInfinite = <TData = InfiniteData<Common.UserServiceGetApiV1AccountByIdOrdersDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id, pageSize }: {
  id: string;
  pageSize?: number;
}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseUserServiceGetApiV1AccountByIdOrdersKeyFn({ id, pageSize }, queryKey), queryFn: ({ pageParam }) => UserService.getApiV1AccountByIdOrders({ id, page: pageParam as number, pageSize }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
