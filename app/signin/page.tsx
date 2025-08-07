import Image from "next/image";
import { SignInCard } from "@/components/cards/signin-card";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full pt-16">
      <div className="hidden md:flex flex-col items-center justify-center w-1/3 py-2">
        <SignInCard />
      </div>

      <div className="hidden md:block w-2/3 relative">
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
          <SignInCard />
        </div>
      </div>
    </div>
  );
}
