const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

export default function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (process.env.NODE_ENV === "development") {
    return `${src}?w=${width}`;
  }
  
  // For production, return original URLs since Cloudflare Image Resizing requires paid plan
  // and Cloudflare Images requires pre-uploaded images
  return src;
}
