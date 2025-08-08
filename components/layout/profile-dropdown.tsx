import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export function ProfileDropdown({ authToken }: { authToken: string | null }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" aria-label="Open account menu">
          <UserIcon className="h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuGroup>
          {authToken ? (
            <DropdownMenuItem>
              <Link href={`/account`} className="flex items-center">
                View Profile
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Link href={`/signin`} className="flex items-center">
                Sign In
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {authToken && <DropdownMenuItem>Logout</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
