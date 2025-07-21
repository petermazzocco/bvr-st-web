import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateUserModal } from "@/components/modals/update-user-details";
import { User as TUser } from "@/lib/types";

export function AccountInfoCard({ user }: { user: TUser | undefined }) {
  return (
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
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="mt-1 text-foreground">
                {user?.email || "Loading..."}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Phone
              </label>
              <p className="mt-1 text-foreground">
                {user?.phone || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Available Points
              </label>
              <p className="mt-1 text-foreground">
                {user?.points || "Not provided"}
              </p>
            </div>
          </div>
          <UpdateUserModal user={user} userId={user?.id} />
        </CardContent>
      </Card>
    </div>
  );
}
