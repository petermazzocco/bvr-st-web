"use client";

import { useEffect, useRef, useState } from "react";
import { GrainGradient } from "@paper-design/shaders-react";

export const GrainGradientBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setDimensions({ width: el.offsetWidth, height: el.offsetHeight });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {dimensions.width > 0 && (
        <GrainGradient
          width={dimensions.width}
          height={dimensions.height}
          colors={["#c6750c", "#cd5d37"]}
          colorBack="#000a0f"
          softness={0.75}
          intensity={0.64}
          noise={0.5}
          shape="wave"
          speed={0.52}
          scale={2.2}
          offsetX={-1}
          offsetY={0.24}
        />
      )}
    </div>
  );
};
