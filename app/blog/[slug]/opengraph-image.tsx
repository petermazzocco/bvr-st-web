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
    imgSrc: post.data.image?.Asset?.ID
      ? // @ts-expect-error improper typing
        `https://cdn.sanity.io/images/${post.data.image.asset.id}`
      : undefined,
  });
}
