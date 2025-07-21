import { notFound } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getPartneredStore } from "@/server/vendor/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen max-w-screen">
      <div className="flex flex-col">
        <div className="relative w-full">
          <AspectRatio ratio={3 / 1} className="w-full">
            <div
              className="relative h-full w-full overflow-hidden p-4 bg-cover bg-center"
              style={{
                backgroundImage: store.data.banner
                  ? `url(${store.data.banner})`
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-6 left-6 flex items-end gap-4">
                <Avatar className="size-24 border-2 border-muted-foreground shadow-lg">
                  <AvatarImage src={store.data.logo} alt={store.data.name} />
                  <AvatarFallback className="bg-background text-gray-900 text-xl font-bold">
                    {store.data.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute bottom-6 right-6 max-w-md text-right">
                <h1 className="text-4xl font-bold text-background drop-shadow-lg mb-2">
                  {store.data.name}
                </h1>
                <p className="text-accent text-sm drop-shadow-md">
                  {store.data.description}
                </p>
                {store.data.shopLink && (
                  <Link href={store.data.shopLink}>
                    <Button
                      variant={"link"}
                      size={"sm"}
                    >{`Learn More About ${store.data.name}`}</Button>
                  </Link>
                )}
              </div>
            </div>
          </AspectRatio>
        </div>
        <div className="px-4">{children}</div>
      </div>
    </div>
  );
}
