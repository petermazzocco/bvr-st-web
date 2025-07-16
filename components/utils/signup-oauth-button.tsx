"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signInWithOAuth } from "@/server/user/actions";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useAuth } from "@/components/auth/auth-context";

interface SignInOAuthButtonProps {
  provider: string;
  children: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export function SignInOAuthButton({
  provider,
  children,
  className,
  variant = "outline",
  size = "default",
  disabled = false,
}: SignInOAuthButtonProps) {
  const searchParams = useSearchParams();
  const { refreshAuth } = useAuth();

  // Capitalize provider name for display
  const providerDisplayName =
    provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase();

  const { mutate: signInOAuthMutation, isPending: isSigningInWithOAuth } =
    useApiMutation(
      (data: { provider: string; callbackUrl: string }) =>
        signInWithOAuth(data.provider, data.callbackUrl),
      {
        onSuccess: (data) => {
          // data is guaranteed to be defined here and is the actual response data
          if (data?.redirectUrl) {
            // Redirect to OAuth provider
            window.location.href = data.redirectUrl;
          } else {
            // If no redirect URL, refresh auth state in case we got a token
            refreshAuth();
          }
        },
        onError: (error) => {
          toast.error(error);
          console.error(`Error signing in with ${provider}:`, error);
        },
      },
    );

  const handleOAuthSignIn = () => {
    const redirect = searchParams.get("redirect");
    const callbackUrl = redirect
      ? `${process.env.NEXT_PUBLIC_BASE_URL}${redirect}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/account`;

    signInOAuthMutation({
      provider: provider.toLowerCase(),
      callbackUrl,
    });
  };

  // If no children provided, use default dynamic text
  const buttonContent = children || `Continue with ${providerDisplayName}`;

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleOAuthSignIn}
      disabled={disabled || isSigningInWithOAuth}
      data-umami-event={`Signin ${provider} button`}
    >
      {isSigningInWithOAuth
        ? `Signing in with ${providerDisplayName}...`
        : buttonContent}
    </Button>
  );
}

// Convenience component for Google OAuth
export function GoogleSignInButton({
  className,
  variant = "outline",
  size = "default",
  disabled = false,
}: Omit<SignInOAuthButtonProps, "provider" | "children">) {
  return (
    <SignInOAuthButton
      provider="google"
      className={className}
      variant={variant}
      size={size}
      disabled={disabled}
    >
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </SignInOAuthButton>
  );
}
