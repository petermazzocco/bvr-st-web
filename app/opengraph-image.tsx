import OpengraphImage from "@/components/utils/opengraph-image";

export const runtime = "edge";

export default async function Image() {
  return await OpengraphImage();
}
