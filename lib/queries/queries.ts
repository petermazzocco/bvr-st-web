// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { AuthenticationService, ShopifyService, StripeService, UserService } from "../requests/services.gen";
import { models_User } from "../requests/types.gen";
import * as Common from "./common";
export const useUserServiceGetApiV1AccountById = <TData = Common.UserServiceGetApiV1AccountByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUserServiceGetApiV1AccountByIdKeyFn({ id }, queryKey), queryFn: () => UserService.getApiV1AccountById({ id }) as TData, ...options });
export const useUserServiceGetApiV1AccountByIdOrders = <TData = Common.UserServiceGetApiV1AccountByIdOrdersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id, page, pageSize }: {
  id: string;
  page?: number;
  pageSize?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUserServiceGetApiV1AccountByIdOrdersKeyFn({ id, page, pageSize }, queryKey), queryFn: () => UserService.getApiV1AccountByIdOrders({ id, page, pageSize }) as TData, ...options });
export const useUserServiceGetApiV1AccountByIdPoints = <TData = Common.UserServiceGetApiV1AccountByIdPointsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUserServiceGetApiV1AccountByIdPointsKeyFn({ id }, queryKey), queryFn: () => UserService.getApiV1AccountByIdPoints({ id }) as TData, ...options });
export const useUserServiceGetApiV1AccountByIdRewards = <TData = Common.UserServiceGetApiV1AccountByIdRewardsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUserServiceGetApiV1AccountByIdRewardsKeyFn({ id }, queryKey), queryFn: () => UserService.getApiV1AccountByIdRewards({ id }) as TData, ...options });
export const useUserServicePostApiV1AccountByIdRewardsRedeem = <TData = Common.UserServicePostApiV1AccountByIdRewardsRedeemMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: { [key: string]: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: { [key: string]: string; };
}, TContext>({ mutationFn: ({ id, requestBody }) => UserService.postApiV1AccountByIdRewardsRedeem({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useAuthenticationServicePostApiV1AuthSigninEmail = <TData = Common.AuthenticationServicePostApiV1AuthSigninEmailMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: { callbackUrl?: string; email?: string; password?: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: { callbackUrl?: string; email?: string; password?: string; };
}, TContext>({ mutationFn: ({ requestBody }) => AuthenticationService.postApiV1AuthSigninEmail({ requestBody }) as unknown as Promise<TData>, ...options });
export const useAuthenticationServicePostApiV1AuthSigninPhone = <TData = Common.AuthenticationServicePostApiV1AuthSigninPhoneMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: { callbackUrl?: string; password?: string; phone?: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: { callbackUrl?: string; password?: string; phone?: string; };
}, TContext>({ mutationFn: ({ requestBody }) => AuthenticationService.postApiV1AuthSigninPhone({ requestBody }) as unknown as Promise<TData>, ...options });
export const useAuthenticationServicePostApiV1AuthSignout = <TData = Common.AuthenticationServicePostApiV1AuthSignoutMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => AuthenticationService.postApiV1AuthSignout() as unknown as Promise<TData>, ...options });
export const useAuthenticationServicePostApiV1AuthSignup = <TData = Common.AuthenticationServicePostApiV1AuthSignupMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: models_User;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: models_User;
}, TContext>({ mutationFn: ({ requestBody }) => AuthenticationService.postApiV1AuthSignup({ requestBody }) as unknown as Promise<TData>, ...options });
export const useShopifyServicePostApiV1WebhooksShopify = <TData = Common.ShopifyServicePostApiV1WebhooksShopifyMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: unknown;
  xShopifyHmacSha256: string;
  xShopifyShopDomain: string;
  xShopifyTopic: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: unknown;
  xShopifyHmacSha256: string;
  xShopifyShopDomain: string;
  xShopifyTopic: string;
}, TContext>({ mutationFn: ({ requestBody, xShopifyHmacSha256, xShopifyShopDomain, xShopifyTopic }) => ShopifyService.postApiV1WebhooksShopify({ requestBody, xShopifyHmacSha256, xShopifyShopDomain, xShopifyTopic }) as unknown as Promise<TData>, ...options });
export const useStripeServicePostApiV1WebhooksStripe = <TData = Common.StripeServicePostApiV1WebhooksStripeMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: unknown;
  stripeSignature: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: unknown;
  stripeSignature: string;
}, TContext>({ mutationFn: ({ requestBody, stripeSignature }) => StripeService.postApiV1WebhooksStripe({ requestBody, stripeSignature }) as unknown as Promise<TData>, ...options });
export const useUserServicePutApiV1AccountById = <TData = Common.UserServicePutApiV1AccountByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: models_User;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: models_User;
}, TContext>({ mutationFn: ({ id, requestBody }) => UserService.putApiV1AccountById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useUserServiceDeleteApiV1AccountById = <TData = Common.UserServiceDeleteApiV1AccountByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => UserService.deleteApiV1AccountById({ id }) as unknown as Promise<TData>, ...options });
