import { client } from "@/lib/sanity/client";
import { SanityDocument } from "next-sanity";
import { notFound } from "next/navigation";

const TEAM_QUERY = `*[_type == "team"]`;

const options = { next: { revalidate: 30 } };

export default async function Page() {
  // fetch team members
  const teamMembers = await client.fetch<SanityDocument[]>(
    TEAM_QUERY,
    {},
    options,
  );

  if (!teamMembers) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2"></div>
  );
}
