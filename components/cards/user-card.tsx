import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon, MapPin } from "lucide-react";
import { ModelsUser } from "@/lib/api/model/modelsUser";

export function UserCard({ user }: { user: ModelsUser | undefined }) {
  if (!user) return null;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-lg">
              {user.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserIcon className="w-4 h-4" />
              <span>Member since {user?.createdAt}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>
                {user.address.street} {user.address.city}, {user.address.state}{" "}
                {user.address.zip}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{user.points}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
