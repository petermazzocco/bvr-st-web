import { ForgotPasswordOTPCard } from "@/components/cards/forgot-password-otp-card";
import { redirect } from "next/navigation";
import Image from "next/image";

interface VerifyPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;
  const email = params.email;

  if (!email) {
    redirect("/forgot-password");
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:flex flex-col items-center justify-center w-2/5 py-2">
        <ForgotPasswordOTPCard email={decodeURIComponent(email)} />
      </div>

      <div className="hidden md:block w-3/5 relative">
        <Image
          src="/auth.jpg"
          alt="Authentication illustration"
          fill
          className="object-cover"
        />
      </div>

      <div className="md:hidden relative w-full min-h-screen">
        <Image
          src="/auth.jpg"
          alt="Authentication illustration"
          fill
          className="object-cover blur-sm"
        />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-2">
          <ForgotPasswordOTPCard email={decodeURIComponent(email)} />
        </div>
      </div>
    </div>
  );
}
