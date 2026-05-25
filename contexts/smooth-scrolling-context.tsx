// components/SmoothScrolling.js
"use client"; // Important for client-side components in Next.js App Router
import { ReactLenis } from "lenis/react";

export function SmoothScrollingContext({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 0.7, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
