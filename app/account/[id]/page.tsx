import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Order, User } from "@/lib/types";
import { getUser, getUserOrders } from "@/server/user/actions";
import { Input } from "@/components/ui/input";
import { OrderCard } from "@/components/cards/order-card";
import { UserCard } from "@/components/cards/user-card";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // const orders = await getUserOrders(id);
  // const user = await getUser(id);
  const mockUser: User = {
    id: "USER-001",
    image: "/placeholder.svg?height=80&width=80",
    points: 100,
    email: "user@example.com",
    name: "John Doe",
    address: {
      street: "123 Main St",
      apt: "Apt 1",
      city: "Anytown",
      state: "CA",
      zip: "12345",
    },
    phone: "555-1234",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-16"),
  };
  const mockOrders = [
    {
      id: "ORD-001",
      userID: id,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-16"),
      status: "Delivered",
      tracking: "ABC123",
      total: 119.97, // (29.99 * 2) + 59.99 = 119.97
      products: [
        {
          id: "PROD-001",
          name: "Classic Cotton T-Shirt",
          image: "/placeholder.svg?height=80&width=80",
          price: 29.99,
          quantity: 2,
          size: "M", // Added missing size property
        },
        {
          id: "PROD-002",
          name: "Denim Jacket",
          image: "/placeholder.svg?height=80&width=80",
          price: 59.99,
          quantity: 1,
          size: "L", // Added missing size property
        },
      ],
    },
    {
      id: "ORD-002",
      userID: id,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-16"),
      status: "Shipped",
      total: 104.98, // 79.99 + 24.99 = 104.98
      tracking: "ABC123",
      products: [
        {
          id: "PROD-003",
          name: "Sneakers",
          image: "/placeholder.svg?height=80&width=80",
          price: 79.99,
          quantity: 1,
          size: "10", // Added missing size property
        },
        {
          id: "PROD-004",
          name: "Baseball Cap",
          image: "/placeholder.svg?height=80&width=80",
          price: 24.99,
          quantity: 1,
          size: "One Size", // Added missing size property
        },
      ],
    },
    {
      id: "ORD-003",
      userID: id,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-16"),
      status: "Processing",
      total: 129.99,
      tracking: "ABC123",
      products: [
        {
          id: "PROD-005",
          name: "Winter Coat",
          image: "/placeholder.svg?height=80&width=80",
          price: 129.99,
          quantity: 1,
          size: "XL", // Added missing size property
        },
      ],
    },
  ] as Order[];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header with User Info */}
        <UserCard user={mockUser} />

        {/* Orders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Order History</h2>
            <Input className="w-1/3" placeholder="Search Orders" />
          </div>

          <div className="space-y-4">
            {mockOrders.map((order) => (
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
