import {
  getUserDetails,
  getUserDiscountCodes,
  getUserOrders,
} from "@/server/user/actions";
import { AccountHeaderCard } from "@/components/cards/account-header-card";
import { AccountOrdersCard } from "@/components/cards/account-orders-card";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get("bvrstco_auth");
  const authToken = authTokenCookie?.value || null;

  let userId: string | null = null;
  if (authToken) {
    try {
      const payload = JSON.parse(atob(authToken.split(".")[1]));
      userId = payload.userid || null;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  if (!userId || !authToken) {
    return redirect("/");
  }

  // Fetch all data
  const user = await getUserDetails(authToken, userId);
  const orders = await getUserOrders(authToken, userId);
  const discountCodes = await getUserDiscountCodes(authToken, userId);

  if (!user.data || (user && !user.success)) {
    return redirect("/signup");
  }

  return (
    <div className="min-h-screen pt-16">
      <Suspense fallback={<Skeleton className="h-52 w-full " />}>
        <AccountHeaderCard user={user?.data} discountCodes={discountCodes} />
      </Suspense>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="space-y-2">
          <Suspense fallback={<Skeleton className="h-screen w-full " />}>
            {orders && <AccountOrdersCard orders={orders} />}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
