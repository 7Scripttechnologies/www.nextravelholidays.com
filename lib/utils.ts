export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function isRemoteSrc(src: string) {
  return /^https?:\/\//i.test(src);
}

export function isUnoptimizedSrc(src: string) {
  const value = src.trim();
  return (
    isRemoteSrc(value) ||
    value.startsWith("/uploads/") ||
    value.startsWith("/api/media/")
  );
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
