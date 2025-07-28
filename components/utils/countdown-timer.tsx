"use client";

import { useState, useEffect } from "react";

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const date = process.env.NEXT_PUBLIC_COMING_SOON_TARGET_DATE as string;
    const targetDate = new Date(date);

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 text-background mt-4">
      <div className="text-center">
        <div className="text-2xl font-bold">{timeLeft.days}</div>
        <div className="text-sm">DAYS</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{timeLeft.hours}</div>
        <div className="text-sm">HOURS</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{timeLeft.minutes}</div>
        <div className="text-sm">MINS</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{timeLeft.seconds}</div>
        <div className="text-sm">SECS</div>
      </div>
    </div>
  );
};
