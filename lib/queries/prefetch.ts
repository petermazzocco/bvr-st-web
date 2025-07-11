// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { UserService } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseUserServiceGetApiV1AccountById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseUserServiceGetApiV1AccountByIdKeyFn({ id }), queryFn: () => UserService.getApiV1AccountById({ id }) });
export const prefetchUseUserServiceGetApiV1AccountByIdOrders = (queryClient: QueryClient, { id, page, pageSize }: {
  id: string;
  page?: number;
  pageSize?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseUserServiceGetApiV1AccountByIdOrdersKeyFn({ id, page, pageSize }), queryFn: () => UserService.getApiV1AccountByIdOrders({ id, page, pageSize }) });
export const prefetchUseUserServiceGetApiV1AccountByIdPoints = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseUserServiceGetApiV1AccountByIdPointsKeyFn({ id }), queryFn: () => UserService.getApiV1AccountByIdPoints({ id }) });
export const prefetchUseUserServiceGetApiV1AccountByIdRewards = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseUserServiceGetApiV1AccountByIdRewardsKeyFn({ id }), queryFn: () => UserService.getApiV1AccountByIdRewards({ id }) });
