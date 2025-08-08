import Image from "next/image";
import { SignInCard } from "@/components/cards/signin-card";
import { ErrorMessage } from "@/components/utils/error-message";

interface SignInPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function Page({ searchParams }: SignInPageProps) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen w-full pt-16">
      <div className="hidden md:flex flex-col items-center justify-center w-2/5 py-2">
        <SignInCard />
        {error && <ErrorMessage message={error} className="w-fit" />}
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
          <SignInCard />
          {error && <ErrorMessage message={error} className="w-fit" />}
        </div>
      </div>
    </div>
  );
}
