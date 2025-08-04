"use client";

import { useAuth } from "@/components/auth/auth-context";
import { useEffect, useState } from "react";
import { getMembershipStatus } from "@/server/user/actions";

export function useMemberStatus() {
  const { isAuthenticated, token, userId } = useAuth();
  const [isMember, setIsMember] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchMembershipStatus() {
      if (!isAuthenticated || !token || !userId) {
        setIsMember(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await getMembershipStatus(token, userId);
        setIsMember(result || false);
      } catch (error) {
        setIsMember(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembershipStatus();
  }, [isAuthenticated, token, userId]);

  return { isMember, isLoading };
}
