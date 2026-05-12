const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL =
  configuredApiBaseUrl ||
  (import.meta.env.DEV ? "http://localhost:4000/api" : "/api");

export function apiUrl(path = "") {
  if (/^https?:\/\//i.test(path)) return path;
  const base = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
