import { SignUpCard } from "@/components/cards/signup-card";
import Image from "next/image";

export const dynamic = "force-static";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 py-2">
        <SignUpCard />
      </div>

      <div className="hidden md:block w-1/2 relative">
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
          <SignUpCard />
        </div>
      </div>
    </div>
  );
}
