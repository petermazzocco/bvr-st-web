import OpengraphImage from "@/components/utils/opengraph-image";

export const runtime = "edge";

export default async function Image() {
  return await OpengraphImage({ imgSrc: "/logo.png", title: "BVR ST CO" });
}
