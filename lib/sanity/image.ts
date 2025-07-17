import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  if (!source || !source.asset || !source.asset._ref || source.asset._ref === 'image-') {
    return null;
  }
  try {
    return builder.image(source);
  } catch (error) {
    console.warn('Invalid image source:', source, error);
    return null;
  }
}

// Alternative with more control
export function getImageUrl(source: any, width?: number, height?: number) {
  if (!source || !source.asset || !source.asset._ref || source.asset._ref === 'image-') {
    return null;
  }
  
  try {
    let url = builder.image(source);

    if (width) {
      url = url.width(width);
    }

    if (height) {
      url = url.height(height);
    }

    return url.url();
  } catch (error) {
    console.warn('Invalid image source:', source, error);
    return null;
  }
}
