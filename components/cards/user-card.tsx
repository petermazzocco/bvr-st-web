"use client";
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User, ApiResult } from "@/lib/types";
import { UpdateUserModal } from "../modals/update-user-details";
import { ChangePasswordModal } from "../modals/change-user-password";
import { ResendOTPModal } from "../modals/resend-otp-modal";
import Link from "next/link";
import { SignOutButton } from "../utils/signout-button";

export function UserCard({ user }: { user: ApiResult<User> | undefined }) {
  if (!user) return null;

  return (
    <>
      <Card className="w-full border-none">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-bold">
                {user.data?.firstName} {user.data?.lastName}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="w-4 h-4" />
                {user.data?.isMember ? (
                  "Member since " +
                  new Date(user.data?.createdAt).toLocaleDateString()
                ) : (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/membership">Become A Member</Link>
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>
                  {user.data?.address.street} {user.data?.address.city},{" "}
                  {user.data?.address.state} {user.data?.address.zip}
                </span>
              </div>
            </div>
            <div className="text-right flex flex-col justify-between gap-6">
              <div className="flex flex-row justify-end gap-2 items-end">
                <div className="text-2xl font-bold text-primary">
                  {user.data?.points}
                </div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
              <div className="flex gap-2">
                <UpdateUserModal
                  user={{
                    firstName: user?.data?.firstName || "",
                    lastName: user?.data?.lastName || "",
                    phone: user?.data?.phone || "",
                    email: user.data?.email || "",
                    address: user.data?.address || {
                      street: "",
                      city: "",
                      state: "",
                      zip: "",
                    },
                  }}
                  userId={user.data?.id || ""}
                />
                <ChangePasswordModal userId={user.data?.id || ""} />
                <SignOutButton iconSize="w-4 h-4" variant={"outline"} />
              </div>
            </div>
          </div>
          <div className="flex flex-col max-w-screen-lg justify-center items-center w-full">
            {!user.data?.emailVerified && (
              <div className="bg-destructive/20 rounded-md p-3 mt-4 flex flex-col items-start gap-4">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Email verification required
                </p>
                <p className="text-xs text-destructive mt-1">
                  It looks like you have not verified your email yet. Please
                  verify your email to access all features.
                </p>
                {!user.data?.emailVerified && (
                  <ResendOTPModal email={user.data?.email || ""} />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
