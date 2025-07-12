"use client";
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon, MapPin, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { UpdateUserModal } from "../modals/update-user-details";
import { ChangePasswordModal } from "../modals/change-user-password";

export function UserCard({ user }: { user: User | undefined }) {
  const router = useRouter();
  if (!user) return null;

  const signOut = () => {
    try {
      // Remove the auth token cookie
      Cookies.remove("authToken");
      router.push("/");
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      return { success: false, error };
    }
  };

  return (
    <Card className="w-full border-none">
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
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
          <div className="text-right flex flex-col justify-between gap-6">
            <div className="flex flex-row justify-end gap-2 items-end">
              <div className="text-2xl font-bold text-primary">
                {user.points}
              </div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
            <div className="flex gap-2">
              <UpdateUserModal user={user} userId={user.id} />
              <ChangePasswordModal userId={user.id} />
              <Button onClick={signOut} variant="outline" size="sm">
                Sign Out
                <LogOutIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
