"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  LogOut,
  MapPin,
  Star,
  User,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useAuth,
  useAuthToken,
  useUserId,
} from "@/components/auth/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserDetails, getUserOrders } from "@/server/user/actions";
import {
  getCustomerPaymentMethods,
  getSubscriptionPaymentInfo,
  getPaymentHistory,
  createBillingPortalSession,
} from "@/server/stripe/actions";
import { UpdateUserModal } from "@/components/modals/update-user-details";

export default function ProfilePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const userId = useUserId();
  const authToken = useAuthToken();
  const queryClient = useQueryClient();

  const signOutMutation = useMutation({
    mutationFn: async () => {
      logout();
      queryClient.clear();
    },
    onSuccess: () => {
      router.push("/signin");
    },
    onError: (error) => {
      console.error("Sign out error:", error);
    },
  });

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserDetails(authToken || undefined, userId!),
    enabled: !!userId && !!authToken && isAuthenticated,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["userOrders", userId, currentPage, pageSize],
    queryFn: () =>
      getUserOrders(authToken || undefined, userId!, currentPage, pageSize),
    enabled: !!userId && !!authToken && isAuthenticated,
  });

  const { data: paymentMethods, isLoading: paymentMethodsLoading } = useQuery({
    queryKey: ["paymentMethods", userId],
    queryFn: () => getCustomerPaymentMethods(userId!, authToken!),
    enabled: !!userId && !!authToken && isAuthenticated,
  });

  const { data: subscriptionInfo, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["subscriptionInfo", userId],
    queryFn: () => getSubscriptionPaymentInfo(userId!, authToken!),
    enabled: !!userId && !!authToken && isAuthenticated,
  });

  const { data: paymentHistory, isLoading: paymentHistoryLoading } = useQuery({
    queryKey: ["paymentHistory", userId],
    queryFn: () => getPaymentHistory(userId!, authToken!, "10"),
    enabled: !!userId && !!authToken && isAuthenticated,
  });

  const billingPortalMutation = useMutation({
    mutationFn: async () => {
      const response = await createBillingPortalSession(
        userId!,
        window.location.href,
        authToken!
      );
      return response;
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      console.error("Billing portal error:", error);
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  const filteredOrders = orders?.data || [];
  const totalPages = Math.ceil((orders?.data?.length || 0) / pageSize);

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row w-full justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {user?.data?.firstName} {user?.data?.lastName}
                </h1>
                <p className="text-muted-foreground">
                  {user?.data?.email || "Loading..."}
                </p>
                {user?.data?.isMember && (
                  <Badge variant="secondary" className="mt-1">
                    <Star className="w-3 h-3 mr-1" />
                    Member since {user.data?.createdAt}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 ">
              {!user?.data?.isMember && (
                <Link href="/membership">
                  <Button variant="default">Become A Member</Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={signOutMutation.isPending}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {signOutMutation.isPending ? "Signing Out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 w-full  h-full">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Name
                      </label>
                      <p className="mt-1 text-foreground">
                        {user?.data?.firstName} {user?.data?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Email
                      </label>
                      <p className="mt-1 text-foreground">
                        {user?.data?.email || "Loading..."}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Phone
                      </label>
                      <p className="mt-1 text-foreground">
                        {user?.data?.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Available Points
                      </label>
                      <p className="mt-1 text-foreground">
                        {user?.data?.points || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <UpdateUserModal user={user?.data} userId={user?.data?.id} />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 w-full">
              <Card className="h-44">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-gray-900">
                      {user?.data?.address?.street}
                    </p>
                    <p className="text-gray-900">
                      {user?.data?.address?.city}, {user?.data?.address?.state}{" "}
                      {user?.data?.address?.zip}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {paymentMethods && paymentMethods?.length > 0 && (
              <div className="flex-1 w-full">
                <Card className="h-44">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paymentMethodsLoading ? (
                      <div className="flex justify-center items-center h-20">
                        <div className="text-center">
                          Loading payment methods...
                        </div>
                      </div>
                    ) : paymentMethods && paymentMethods.length > 0 ? (
                      <>
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className="flex items-center justify-between  rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8  rounded flex items-center justify-center">
                                <CreditCard className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {method.card?.brand.toUpperCase() ||
                                    method.type.toUpperCase()}{" "}
                                  ending in{" "}
                                  {method.card?.last4 || method.bank?.last4}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {method.card
                                    ? `Expires ${method.card.exp_month}/${method.card.exp_year}`
                                    : method.bank?.account_type}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {method.is_default && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => billingPortalMutation.mutate()}
                                disabled={billingPortalMutation.isPending}
                              >
                                {billingPortalMutation.isPending ? "Loading..." : "Edit"}{" "}
                                <ExternalLinkIcon className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          No payment methods on file
                        </p>
                        <Button variant="outline" size="sm">
                          Add New Card
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {paymentHistory && paymentHistory.length > 0 && (
          <Card className="mt-2 ">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Recent payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentHistoryLoading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="text-center">Loading payment history...</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(payment.paid_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${payment.amount / 100} </TableCell>
                        <TableCell>
                          <Badge variant={"outline"}>
                            {payment.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.payment_method}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Full Order History */}
        <Card className="mt-2">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              Complete history of your purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-center">Loading orders...</div>
              </div>
            ) : filteredOrders && filteredOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {orders?.data?.length || "Order items"}
                      </TableCell>
                      <TableCell>${order.total}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex justify-center items-center h-32">
                <div className="text-center">No orders found</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {filteredOrders && filteredOrders.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePrevious();
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {/* First page */}
                {currentPage > 2 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(1);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Ellipsis before current page */}
                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Previous page */}
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                    >
                      {currentPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Current page */}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive
                    onClick={(e) => e.preventDefault()}
                  >
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>

                {/* Next page */}
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                    >
                      {currentPage + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Ellipsis after current page */}
                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Last page */}
                {currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPages);
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNext();
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
