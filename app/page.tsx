import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Shop | BVR STR",
  description: "Shop BVR STR and support Oregon State University.",
  openGraph: {
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-end bg-[url('../public/labubu-bg.jpg')] bg-cover bg-center">
      <div className="mb-44 flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold text-foreground ">
          BVRSTR x Labubu
        </h1>
        <Button
          variant="outline"
          size="lg"
          asChild
          className="flex items-center text-xl justify-center gap-2"
        >
          <Link href="/auctions">
            Bid Now <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
