"use client";

import { useEffect, useState } from "react";
import { Dithering } from "@paper-design/shaders-react";

/**
 * Full-viewport dithering shader. `fixed` so it stays put while the page
 * scrolls over it (parallax/sticky). Sized from window dimensions since
 * <Dithering /> takes numeric width/height, not CSS.
 */
export function HeroDitheringBackground() {
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!size) return null;

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Dithering
        width={size.width}
        height={size.height}
        colorBack="#000000"
        colorFront="#FF7E42"
        shape="warp"
        type="4x4"
        size={2.4}
        speed={0.01}
        scale={1.0}
      />
    </div>
  );
}
