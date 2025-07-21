"use client";
import { LogOut, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import { signOut } from "@/server/user/actions";

export function AccountHeaderCard({ user }: { user: User | undefined }) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        router.push("/");
      } else {
        console.error("Sign out failed:", result.error);
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className=" border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row w-full justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-muted-foreground">
                {user?.email || "Loading..."}
              </p>
              {user?.isMember && (
                <Badge variant="secondary" className="mt-1">
                  <Star className="w-3 h-3 mr-1" />
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 ">
            {!user?.isMember && (
              <Link href="/membership">
                <Button variant="default">Become A Member</Button>
              </Link>
            )}
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
