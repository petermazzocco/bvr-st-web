// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { UserService } from "../requests/services.gen";
import * as Common from "./common";
export const ensureUseUserServiceGetApiV1AccountByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseUserServiceGetApiV1AccountByIdKeyFn({ id }), queryFn: () => UserService.getApiV1AccountById({ id }) });
export const ensureUseUserServiceGetApiV1AccountByIdOrdersData = (queryClient: QueryClient, { id, page, pageSize }: {
  id: string;
  page?: number;
  pageSize?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseUserServiceGetApiV1AccountByIdOrdersKeyFn({ id, page, pageSize }), queryFn: () => UserService.getApiV1AccountByIdOrders({ id, page, pageSize }) });
export const ensureUseUserServiceGetApiV1AccountByIdPointsData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseUserServiceGetApiV1AccountByIdPointsKeyFn({ id }), queryFn: () => UserService.getApiV1AccountByIdPoints({ id }) });
export const ensureUseUserServiceGetApiV1AccountByIdRewardsData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseUserServiceGetApiV1AccountByIdRewardsKeyFn({ id }), queryFn: () => UserService.getApiV1AccountByIdRewards({ id }) });
