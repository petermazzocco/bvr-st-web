"use client";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { getTeamMembers } from "@/server/sanity/actions";
import { Team } from "@/lib/types";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Loading component for the hero section
function HeroSkeleton() {
  return (
    <div className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-300 animate-pulse" />
      <div className="relative z-10 text-center">
        <div className="bg-gray-400 animate-pulse h-24 w-96 mx-auto rounded" />
      </div>
    </div>
  );
}

// Loading component for the content section
function ContentSkeleton() {
  return (
    <div className="bg-background py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Lorem Ipsum Skeleton */}
        <div className="mb-16 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
          <Skeleton className="h-4 w-4/5 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>

        {/* Team Section Skeleton */}
        <div>
          <Skeleton className="h-12 w-48 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-lg"
              >
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Team grid component
function TeamGrid({ teamMembers }: { teamMembers: Team[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teamMembers.map((member) => (
        <div
          key={member._id}
          className="flex flex-col items-center p-6 bg-muted "
        >
          <Avatar>
            <AvatarImage src={member.image.asset.url} alt={member.name} />
            <AvatarFallback>{member.name[0]}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
            {member.name}
          </h3>
          <p className="text-gray-600">{member.title}</p>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const {
    mutate: fetchTeamMembers,
    data: teamMembers,
    isPending,
    error,
  } = useApiMutation<Team[], void>(
    async (_variables: void) => {
      return await getTeamMembers();
    },
    {
      onError: (error) => {
        console.error("Failed to fetch team members:", error);
      },
    },
  );

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // Show loading state for entire page while fetching
  if (isPending) {
    return (
      <div className="min-h-screen">
        <HeroSkeleton />
        <ContentSkeleton />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen">
        {/* Hero Section - Always show */}
        <div className="relative h-screen flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(/mock-auth.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 text-center text-white">
            <h1 className="text-8xl font-bold tracking-wider">BVR STR CO</h1>
          </div>
        </div>

        {/* Error Content */}
        <div className="bg-background py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg text-gray-600 mb-16 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <div>
              <h2 className="text-4xl font-bold mb-12 text-gray-800">
                Our Team
              </h2>
              <p className="text-destructive text-lg">
                Failed to load team members. Please try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="min-h-screen">
        {/* Hero Section - Always show */}
        <div className="relative h-screen flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(/mock-auth.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 text-center text-white">
            <h1 className="text-8xl font-bold tracking-wider">BVR STR CO</h1>
          </div>
        </div>

        {/* Empty Content */}
        <div className="bg-background py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg text-gray-600 mb-16 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <div>
              <h2 className="text-4xl font-bold mb-12 text-gray-800">
                Our Team
              </h2>
              <p className="text-gray-500 text-lg">No team members found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show full page with data
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/mock-auth.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-8xl font-bold tracking-wider">BVR STR CO</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 text-left">
          <h2 className="text-lg text-left font-bold mb-4 text-foreground">
            Mission
          </h2>
          {/* Lorem Ipsum Text */}
          <p className="text-md text-muted-foreground mb-16 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>

          {/* Team Section */}
          <div>
            <h2 className="text-lg text-left font-bold mb-4 text-foreground">
              Team
            </h2>
            <TeamGrid teamMembers={teamMembers} />
          </div>
        </div>
      </div>
    </div>
  );
}
