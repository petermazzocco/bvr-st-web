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
import { useParams } from "next/navigation";
import {
  useUserServiceGetApiV1AccountById,
  useUserServiceGetApiV1AccountByIdOrders,
} from "@/lib/queries";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const { data: user } = useUserServiceGetApiV1AccountById({ id: id });

  const { data: orders } = useUserServiceGetApiV1AccountByIdOrders({
    id: id,
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header with User Info */}
        <UserCard user={user} />

        {/* Orders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Order History</h2>
            <Input className="w-1/3" placeholder="Search Orders" />
          </div>

          <div className="space-y-4">
            {orders?.data?.map((order) => (
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
