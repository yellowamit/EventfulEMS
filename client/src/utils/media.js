const API_ORIGIN = "http://localhost:4000";

export function eventImageUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const normalizedPath = imagePath.replace(/\\/g, "/");
  return `${API_ORIGIN}${normalizedPath.startsWith("/") ? "" : "/"}${normalizedPath}`;
}
