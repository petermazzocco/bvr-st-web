import { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  return {
    title: "Account | BVR STR",
    description: "Your BVR STR Collective account.",
    openGraph: {
      type: "website",
    },
  };
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
