// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryResult } from "@tanstack/react-query";
import { AuthenticationService, ShopifyService, StripeService, UserService } from "../requests/services.gen";
export type UserServiceGetApiV1AccountByIdDefaultResponse = Awaited<ReturnType<typeof UserService.getApiV1AccountById>>;
export type UserServiceGetApiV1AccountByIdQueryResult<TData = UserServiceGetApiV1AccountByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUserServiceGetApiV1AccountByIdKey = "UserServiceGetApiV1AccountById";
export const UseUserServiceGetApiV1AccountByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useUserServiceGetApiV1AccountByIdKey, ...(queryKey ?? [{ id }])];
export type UserServiceGetApiV1AccountByIdOrdersDefaultResponse = Awaited<ReturnType<typeof UserService.getApiV1AccountByIdOrders>>;
export type UserServiceGetApiV1AccountByIdOrdersQueryResult<TData = UserServiceGetApiV1AccountByIdOrdersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUserServiceGetApiV1AccountByIdOrdersKey = "UserServiceGetApiV1AccountByIdOrders";
export const UseUserServiceGetApiV1AccountByIdOrdersKeyFn = ({ id, page, pageSize }: {
  id: string;
  page?: number;
  pageSize?: number;
}, queryKey?: Array<unknown>) => [useUserServiceGetApiV1AccountByIdOrdersKey, ...(queryKey ?? [{ id, page, pageSize }])];
export type UserServiceGetApiV1AccountByIdPointsDefaultResponse = Awaited<ReturnType<typeof UserService.getApiV1AccountByIdPoints>>;
export type UserServiceGetApiV1AccountByIdPointsQueryResult<TData = UserServiceGetApiV1AccountByIdPointsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUserServiceGetApiV1AccountByIdPointsKey = "UserServiceGetApiV1AccountByIdPoints";
export const UseUserServiceGetApiV1AccountByIdPointsKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useUserServiceGetApiV1AccountByIdPointsKey, ...(queryKey ?? [{ id }])];
export type UserServiceGetApiV1AccountByIdRewardsDefaultResponse = Awaited<ReturnType<typeof UserService.getApiV1AccountByIdRewards>>;
export type UserServiceGetApiV1AccountByIdRewardsQueryResult<TData = UserServiceGetApiV1AccountByIdRewardsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUserServiceGetApiV1AccountByIdRewardsKey = "UserServiceGetApiV1AccountByIdRewards";
export const UseUserServiceGetApiV1AccountByIdRewardsKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useUserServiceGetApiV1AccountByIdRewardsKey, ...(queryKey ?? [{ id }])];
export type UserServicePostApiV1AccountByIdRewardsRedeemMutationResult = Awaited<ReturnType<typeof UserService.postApiV1AccountByIdRewardsRedeem>>;
export type AuthenticationServicePostApiV1AuthSigninEmailMutationResult = Awaited<ReturnType<typeof AuthenticationService.postApiV1AuthSigninEmail>>;
export type AuthenticationServicePostApiV1AuthSigninPhoneMutationResult = Awaited<ReturnType<typeof AuthenticationService.postApiV1AuthSigninPhone>>;
export type AuthenticationServicePostApiV1AuthSignoutMutationResult = Awaited<ReturnType<typeof AuthenticationService.postApiV1AuthSignout>>;
export type AuthenticationServicePostApiV1AuthSignupMutationResult = Awaited<ReturnType<typeof AuthenticationService.postApiV1AuthSignup>>;
export type ShopifyServicePostApiV1WebhooksShopifyMutationResult = Awaited<ReturnType<typeof ShopifyService.postApiV1WebhooksShopify>>;
export type StripeServicePostApiV1WebhooksStripeMutationResult = Awaited<ReturnType<typeof StripeService.postApiV1WebhooksStripe>>;
export type UserServicePutApiV1AccountByIdMutationResult = Awaited<ReturnType<typeof UserService.putApiV1AccountById>>;
export type UserServiceDeleteApiV1AccountByIdMutationResult = Awaited<ReturnType<typeof UserService.deleteApiV1AccountById>>;
