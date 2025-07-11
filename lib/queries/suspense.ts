// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { UserService } from "../requests/services.gen";
import * as Common from "./common";
export const useUserServiceGetApiV1AccountByIdSuspense = <TData = Common.UserServiceGetApiV1AccountByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUserServiceGetApiV1AccountByIdKeyFn({ id }, queryKey), queryFn: () => UserService.getApiV1AccountById({ id }) as TData, ...options });
export const useUserServiceGetApiV1AccountByIdOrdersSuspense = <TData = Common.UserServiceGetApiV1AccountByIdOrdersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id, page, pageSize }: {
  id: string;
  page?: number;
  pageSize?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUserServiceGetApiV1AccountByIdOrdersKeyFn({ id, page, pageSize }, queryKey), queryFn: () => UserService.getApiV1AccountByIdOrders({ id, page, pageSize }) as TData, ...options });
export const useUserServiceGetApiV1AccountByIdPointsSuspense = <TData = Common.UserServiceGetApiV1AccountByIdPointsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUserServiceGetApiV1AccountByIdPointsKeyFn({ id }, queryKey), queryFn: () => UserService.getApiV1AccountByIdPoints({ id }) as TData, ...options });
export const useUserServiceGetApiV1AccountByIdRewardsSuspense = <TData = Common.UserServiceGetApiV1AccountByIdRewardsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUserServiceGetApiV1AccountByIdRewardsKeyFn({ id }, queryKey), queryFn: () => UserService.getApiV1AccountByIdRewards({ id }) as TData, ...options });
