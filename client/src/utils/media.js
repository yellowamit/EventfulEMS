import { apiUrl } from "./api";

export function eventImageUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const normalizedPath = imagePath.replace(/\\/g, "/");
  return apiUrl(normalizedPath);
}
