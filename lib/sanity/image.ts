import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Alternative with more control
export function getImageUrl(source: any, width?: number, height?: number) {
  let url = builder.image(source);

  if (width) {
    url = url.width(width);
  }

  if (height) {
    url = url.height(height);
  }

  return url.url();
}
