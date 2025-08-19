import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function Navbar() {
  // const cookieStore = await cookies();
  // const authTokenCookie = cookieStore.get("bvrstco_auth");
  // const authToken = authTokenCookie?.value || null;
  return (
    <nav className="fixed top-0 z-50 bg-transparent text-background grid grid-cols-3 items-center p-2 w-full mix-blend-difference">
      <div className="flex items-center">
        <Link href="/">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src="/assets/icons/BEAVER-ST-CO_ICON-05.svg"
              alt="Avatar"
              className="p-1"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <Link href="/">
          <Image
            src="/assets/BEAVER-ST-CO_HORIZONTAL-02.svg"
            alt="BVR ST CO."
            width={170}
            height={50}
          />
        </Link>
      </div>
      <div className="flex items-center justify-end gap-4">
        {/*<Button variant="ghost" size="sm" asChild>
          <Link href={!authToken ? "/account" : "/signin"}>
            <UserIcon className="h-4" />
          </Link>
        </Button>*/}
        {/*<CartSheet />*/}
      </div>
    </nav>
  );
}
