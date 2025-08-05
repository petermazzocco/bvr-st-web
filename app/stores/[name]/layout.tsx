import { notFound } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getPartneredStore } from "@/server/vendor/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function CollectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ name: string; handle: string }>;
}) {
  const resolvedParams = await params;
  const store = await getPartneredStore(resolvedParams.name);

  if (!store.data) {
    return notFound();
  }

  return (
    <div className="min-h-screen max-w-screen pt-16">
      <div className="flex flex-col">
        <div className="relative w-full mb-20">
          <AspectRatio ratio={3 / 1} className="w-full">
            <div
              className="relative h-full w-full overflow-hidden p-4 bg-cover bg-center"
              style={{
                backgroundImage: store.data.banner
                  ? `url(${store.data.banner})`
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            ></div>
          </AspectRatio>
        </div>
        <div className="text-foreground flex-flex-col gap-2 p-4">
          <h1 className="text-lg font-bold drop-shadow-lg mb-4">
            {store.data.name}
          </h1>
          <p className="text-sm drop-shadow-md">{store.data.description}</p>
          {store.data.shopLink && (
            <Link href={store.data.shopLink}>
              <Button
                variant={"link"}
                size={"sm"}
                className="p-0"
              >{`Learn More About ${store.data.name}`}</Button>
            </Link>
          )}
        </div>
        <Separator />
        <div className="px-4">{children}</div>
      </div>
    </div>
  );
}
