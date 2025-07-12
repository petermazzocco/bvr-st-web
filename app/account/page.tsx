"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserIdFromToken } from "@/lib/utils";
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
import { getAuthToken } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "@/server/user/actions";

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = getUserIdFromToken();
    if (!id) {
      // No valid token, redirect to sign in
      router.push("/account/signin");
      return;
    }
    setUserId(id);
  }, [router]);
  console.log(userId);

  const authToken = getAuthToken();

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserDetails(authToken, userId!),
    enabled: !!userId,
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

          {/* <div className="space-y-4">
            {orders?.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div> */}
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
