"use client";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { getTeamMembers } from "@/server/sanity/actions";
import { Team } from "@/lib/types";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const {
    mutate: fetchTeamMembers,
    data: teamMembers,
    isPending,
    error,
  } = useApiMutation<Team[], void>(async (_variables: void) => {
    return await getTeamMembers();
  }, {
    onError: (error) => {
      console.error("Failed to fetch team members:", error);
    },
  });

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center p-4">
              <Skeleton className="h-32 w-32 rounded-full mb-4" />
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <p className="text-destructive">
          Failed to load team members. Please try again.
        </p>
      </div>
    );
  }

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <p className="text-muted-foreground">No team members found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member._id} className="flex flex-col items-center p-4">
            <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
            <p className="text-muted-foreground">{member.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
