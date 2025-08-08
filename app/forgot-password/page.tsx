import { ForgotPasswordEmailCard } from "@/components/cards/forgot-password-email-card";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:flex flex-col items-center justify-center w-2/5 py-2">
        <ForgotPasswordEmailCard />
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
          <ForgotPasswordEmailCard />
        </div>
      </div>
    </div>
  );
}
