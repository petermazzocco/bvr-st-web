"use client";
import { LogOut, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { UpdateUser, User } from "@/lib/types";
import { signOut } from "@/server/user/actions";
import { Button } from "@/components/ui/button";
import { UpdateUserModal } from "../modals/update-user-details";
import { ErrorMessage } from "@/components/utils/error-message";
import Form from "next/form";
import { useActionState } from "react";

export function AccountHeaderCard({
  user,
  discountCodes,
}: {
  user: User | undefined;
  discountCodes?: any;
}) {
  const [message, formAction, pending] = useActionState(signOut, null);
  return (
    <div className=" border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-4 ">
        {message?.error && <ErrorMessage message={message.error} />}
        <div className="flex flex-row w-full justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {user?.firstName} {user?.lastName}
              </h1>
              <div className="flex flex-col items-start gap-2">
                {user?.isMember && (
                  <Badge variant="default" className="mt-1">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </Badge>
                )}
                <Badge variant="outline" className="mt-1">
                  {user?.points || "Loading "} Points
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 ">
            {!user?.isMember && (
              <Link href="/membership">
                <Button variant="default">Become A Member</Button>
              </Link>
            )}
            <div className="flex justify-between items-center gap-2">
              <UpdateUserModal user={user as UpdateUser} />
              <Form action={formAction}>
                <Button
                  disabled={pending}
                  variant="outline"
                  type="submit"
                  className="w-fit"
                  size={"sm"}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </Form>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Shipping Address
            </label>
            <p className="text-foreground">{user?.address || "Not provided"}</p>
          </div>
        </div>
        {discountCodes && discountCodes.lenth > 0 && (
          <div className="grid grid-cols-1  gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Available Discount Codes
              </label>
              {discountCodes.map((code: any) => {
                <p className="mt-1 text-foreground">{code}</p>;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
