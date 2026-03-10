import { isVercelPreviewHost } from "@/flags/flag";

export const getSignInProvider = (host?: string) => {
  return (host && isVercelPreviewHost(host)) ||
    process.env.NODE_ENV !== "production" ||
    process.env.E2E_ENV === "true"
    ? "credentials"
    : "adfs";
};
