"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { OrderCard } from "@/components/cards/order-card";
import { UserCard } from "@/components/cards/user-card";
import {
  useGetApiV1AccountId,
  useGetApiV1AccountIdOrders,
} from "@/lib/api/generated/user/user";
import { useParams } from "next/navigation";
import { ModelsUser } from "@/lib/api/model/modelsUser";
import { ModelsOrder } from "@/lib/api/model";

export default async function Page() {
  const params = useParams();
  const id = params.id as string;

  const { data: user, isLoading: loadingUser } = useGetApiV1AccountId(id);
  const { data: orders, isLoading: loadingOrders } =
    useGetApiV1AccountIdOrders(id);
  const userOrders = orders?.data as unknown as ModelsOrder[];

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header with User Info */}
        <UserCard user={user?.data as ModelsUser} />

        {/* Orders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Order History</h2>
            <Input className="w-1/3" placeholder="Search Orders" />
          </div>

          <div className="space-y-4">
            {userOrders?.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
