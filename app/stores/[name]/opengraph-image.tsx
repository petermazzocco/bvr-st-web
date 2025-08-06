import OpengraphImage from "@/components/utils/opengraph-image";
import { getPartneredStore } from "@/server/vendor/actions";

export const runtime = "edge";

export default async function Image({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const name = await params.then(({ name }) => name);
  const store = await getPartneredStore(name);

  if (!store.success || !store.data) {
    return await OpengraphImage({});
  }

  return await OpengraphImage({
    title: store.data.name,
    imgSrc: store.data.logo || store.data.banner,
  });
}
