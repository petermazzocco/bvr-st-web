import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function SignOutButton({
  iconSize = "w-4 h-4",
  className,
  variant,
  size,
}: {
  iconSize?: string;
  className?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}) {
  const router = useRouter();

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
    <Button
      onClick={signOut}
      className={className}
      variant={variant}
      size={size}
    >
      Sign Out
      <LogOutIcon className={iconSize} />
    </Button>
  );
}
