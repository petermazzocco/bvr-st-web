"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import { signOut } from "@/server/user/actions";
import { useActionState } from "react";
import Form from "next/form";

export function ProfileDropdown() {
  const { isAuthenticated, isLoading } = useAuth();
  const [message, formAction, pending] = useActionState(signOut, null);

  if (isLoading) {
    return (
      <Button
        size="sm"
        variant="ghost"
        aria-label="Loading account menu"
        disabled
      >
        <UserIcon className="h-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" aria-label="Open account menu">
          <UserIcon className="h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuGroup>
          {isAuthenticated ? (
            <>
              <DropdownMenuItem>
                <Link href={`/account`} className="flex items-center text-xs">
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Form action={formAction} className="w-full">
                  <Button
                    disabled={pending}
                    variant="ghost"
                    type="submit"
                    className="w-full justify-start h-auto p-0 font-normal text-xs"
                    size="sm"
                  >
                    {pending ? "Signing out..." : "Sign Out"}
                  </Button>
                </Form>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem>
              <Link href={`/signin`} className="flex items-center">
                Sign In
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
