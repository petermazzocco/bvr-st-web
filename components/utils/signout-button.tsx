import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";

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
  const { logout } = useAuth();

  const signOut = () => {
    try {
      logout();
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
