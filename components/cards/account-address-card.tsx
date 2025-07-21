import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/types";

export function AccountAddressCard({ user }: { user: User | undefined }) {
  return (
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
            <p className="text-muted-foreground">{user?.address?.street}</p>
            <p className="text-muted-foreground">{user?.address?.apt}</p>
            <p className="text-muted-foreground">
              {user?.address?.city}, {user?.address?.state} {user?.address?.zip}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
