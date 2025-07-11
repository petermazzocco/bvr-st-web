import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Package } from "lucide-react";
import Image from "next/image";
import { models_Order } from "@/lib/requests";

export function OrderCard({ order }: { order: models_Order | undefined }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-700 hover:bg-green-500/20";
      case "Shipped":
        return "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20";
      case "Processing":
        return "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80";
    }
  };

  if (!order) return null;

  return (
    <Card key={order.id} className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">Order {order.id}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                <span>{order.createdAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>
                  {order.products.length} item
                  {order.products.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
            <div className="text-right">
              <div className="font-semibold">${order?.total?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {order.products.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold">${item.price.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">each</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
