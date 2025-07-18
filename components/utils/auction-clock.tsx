"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export const AuctionClock = ({ time }: { time: number }) => {
  const [timeLeft, setTimeLeft] = useState(time);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${secs}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else {
      return `${minutes}m ${secs}s`;
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 text-lg">
      <span className="font-semibold">
        {timeLeft > 0 ? formatTime(timeLeft) : "ENDED"}
      </span>
    </div>
  );
};
