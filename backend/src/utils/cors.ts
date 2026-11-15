import { Request } from "express";

export function isAllowedOrigin(testOrigin?: string): boolean {
  if (!testOrigin) return false;
  const cleanOrigin = testOrigin.replace(/\/+$/, "");
  const isProduction = process.env.NODE_ENV === "production";
  const explicitAllowed = [
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ALLOWED_ORIGINS ?? "").split(",").map((v) => v.trim()),
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]
    .filter((v): v is string => Boolean(v))
    .map((v) => v.replace(/\/+$/, ""));

  if (explicitAllowed.includes(cleanOrigin)) return true;
  if (!isProduction && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) {
    return true;
  }
  return false;
}

export function getFrontendUrl(req?: Request, customOrigin?: string): string {
  if (customOrigin && typeof customOrigin === "string") {
    const cleanOrigin = customOrigin.replace(/\/+$/, "");
    if (isAllowedOrigin(cleanOrigin)) return cleanOrigin;
  }
  if (req?.query?.origin && typeof req.query.origin === "string") {
    const cleanOrigin = (req.query.origin as string).replace(/\/+$/, "");
    if (isAllowedOrigin(cleanOrigin)) return cleanOrigin;
  }
  if (req?.headers?.referer) {
    try {
      const refOrigin = new URL(req.headers.referer).origin.replace(/\/+$/, "");
      if (isAllowedOrigin(refOrigin)) return refOrigin;
    } catch {
      // ignore
    }
  }
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL.replace(/\/+$/, "");
  if (process.env.NODE_ENV !== "production") return "http://localhost:4173";
  throw new Error("FRONTEND_URL must be configured outside development");
}
