import { cn } from "@/lib/utils";

type AppImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
};

export default function AppImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority,
}: AppImageProps) {
  return (
    // Uploaded / CMS photos must skip next/image so cPanel can serve the real file.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fetchPriority={priority ? "high" : undefined}
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
    />
  );
}
