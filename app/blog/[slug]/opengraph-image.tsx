import OpengraphImage from "@/components/utils/opengraph-image";
import { getBlogPostBySlug } from "@/server/sanity/actions";

export const runtime = "edge";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = await params.then(({ slug }) => slug);
  const post = await getBlogPostBySlug(slug);

  if (!post.success || !post.data) {
    return await OpengraphImage({});
  }

  return await OpengraphImage({
    title: post.data.title,
    // @ts-expect-error improper typing
    imgSrc: post.data.image?.asset?.url
      ? // @ts-expect-error improper typing
        `${post.data.image.asset.url}`
      : undefined,
  });
}
