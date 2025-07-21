import {
  getUserDetails,
  getUserOrders,
  getAuthTokenServer,
  getUserIdFromTokenServer,
} from "@/server/user/actions";
import { getCustomerPaymentMethods } from "@/server/stripe/actions";
import { AccountAddressCard } from "@/components/cards/account-address-card";
import { AccountHeaderCard } from "@/components/cards/account-header-card";
import { AccountOrdersCard } from "@/components/cards/account-orders-card";
import { AccountInfoCard } from "@/components/cards/account-info-card";
import { AccountPaymentMethodsCard } from "@/components/cards/account-payment-methods-card";
import { OTPCard } from "@/components/cards/otp-card";

export default async function ProfilePage() {
  const userId = await getUserIdFromTokenServer();
  const authToken = await getAuthTokenServer();

  if (!userId || !authToken) {
    return <div>No user id or auth token</div>;
  }

  // Fetch all data
  const user = await getUserDetails(authToken, userId);
  const orders = await getUserOrders(authToken, userId, 1, 10);
  const paymentMethods = await getCustomerPaymentMethods(userId, authToken);

  if (!user || (user && !user.success)) {
    return <div>No user found</div>;
  }

  return (
    <div className="min-h-screen">
      <AccountHeaderCard user={user?.data} />
      {!user.data?.emailVerified && <OTPCard />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row gap-4">
            <AccountInfoCard user={user?.data} />
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <AccountAddressCard user={user?.data} />
            <AccountPaymentMethodsCard paymentMethods={paymentMethods} />
          </div>
        </div>
        {/*
        <AccountPaymentHistoryCard paymentHistory={paymentHistory} /> */}
        <AccountOrdersCard orders={orders} />
      </div>
    </div>
  );
}
