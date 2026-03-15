export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Self-hosted login - redirect to /login page instead of Manus OAuth
export const getLoginUrl = (returnPath?: string) => {
  const base = "/login";
  if (returnPath) {
    return `${base}?return=${encodeURIComponent(returnPath)}`;
  }
  return base;
};
