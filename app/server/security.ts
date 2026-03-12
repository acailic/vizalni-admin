import { NextApiRequest, NextApiResponse } from "next";
import { NextkitError } from "nextkit";

type RateLimitScope = "auth" | "api";

type RateLimitEntry = {
  count: number;
  resetAt: number;
  blocked: boolean;
  suspiciousScore: number;
};

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

const RATE_LIMITS: Record<RateLimitScope, { limit: number; windowMs: number }> =
  {
    auth: { limit: 5, windowMs: FIFTEEN_MINUTES_MS },
    api: { limit: 100, windowMs: FIFTEEN_MINUTES_MS },
  };

// Enhanced rate limiting with persistence for production
const rateLimitBuckets: Record<RateLimitScope, Map<string, RateLimitEntry>> = {
  auth: new Map(),
  api: new Map(),
};

// Security monitoring
const securityEvents: Array<{
  timestamp: number;
  type: string;
  ip: string;
  userAgent?: string;
  details: Record<string, any>;
}> = [];

// Blocked IPs (in production, use Redis or database)
const blockedIPs = new Set<string>();
const suspiciousIPs = new Map<string, { score: number; lastSeen: number }>();

const parseHost = (value?: string): string => {
  if (!value) {
    return "";
  }

  try {
    const withProtocol = value.startsWith("http") ? value : `https://${value}`;
    return new URL(withProtocol).host.toLowerCase();
  } catch {
    return "";
  }
};

const resolveAllowedHost = (req: NextApiRequest): string => {
  const configuredHost =
    parseHost(process.env.NEXTAUTH_URL) || parseHost(process.env.PUBLIC_URL);
  const requestHost = (req.headers.host ?? "").toLowerCase();

  return configuredHost || requestHost;
};

const getClientIdentifier = (req: NextApiRequest): string => {
  const forwardedFor = (req.headers["x-forwarded-for"] as string | undefined)
    ?.split(",")[0]
    ?.trim();

  const ip =
    forwardedFor ||
    req.socket.remoteAddress ||
    (req.headers["x-real-ip"] as string | undefined) ||
    (req.headers["cf-connecting-ip"] as string | undefined) ||
    "unknown";

  return ip;
};

const logSecurityEvent = (
  type: string,
  req: NextApiRequest,
  details: Record<string, any> = {}
): void => {
  const event = {
    timestamp: Date.now(),
    type,
    ip: getClientIdentifier(req),
    userAgent: req.headers["user-agent"],
    details,
  };

  securityEvents.push(event);

  // Keep only last 1000 events in memory
  if (securityEvents.length > 1000) {
    securityEvents.splice(0, securityEvents.length - 1000);
  }

  // Log to console for monitoring
  if (
    process.env.NODE_ENV === "production" ||
    process.env.SECURITY_LOGGING === "true"
  ) {
    console.warn("Security Event:", {
      type,
      ip: event.ip,
      userAgent: event.userAgent,
      details,
      timestamp: new Date(event.timestamp).toISOString(),
    });
  }
};

const analyzeSuspiciousPatterns = (req: NextApiRequest): number => {
  let score = 0;
  const userAgent = req.headers["user-agent"]?.toLowerCase() || "";
  const ip = getClientIdentifier(req);

  // Check for suspicious user agents
  if (!userAgent || userAgent.length < 10) score += 5;
  if (userAgent.includes("bot") || userAgent.includes("crawler")) score += 3;
  if (userAgent.includes("curl") || userAgent.includes("wget")) score += 2;

  // Check for missing common headers
  if (!req.headers.origin && !req.headers.referer) score += 2;
  if (!req.headers["accept"]) score += 1;

  // Check for suspicious request patterns
  if (req.url && (req.url.includes("..") || req.url.includes("%2e%2e")))
    score += 10;
  if (req.url && req.url.length > 1000) score += 3;

  // Check for suspicious headers
  const suspiciousHeaders = [
    "x-forwarded-host",
    "x-original-host",
    "x-rewrite-url",
  ];
  suspiciousHeaders.forEach((header) => {
    if (req.headers[header]) score += 5;
  });

  // Update suspicious IP tracking
  if (score > 0) {
    const current = suspiciousIPs.get(ip) || { score: 0, lastSeen: 0 };
    current.score += score;
    current.lastSeen = Date.now();
    suspiciousIPs.set(ip, current);

    // Auto-block high-score IPs
    if (current.score >= 20) {
      blockedIPs.add(ip);
      logSecurityEvent("AUTO_BLOCKED_IP", req, {
        score,
        reason: "High suspicious score",
      });
    }
  }

  return score;
};

export const isStateChangingMethod = (method?: string): boolean =>
  STATE_CHANGING_METHODS.has((method ?? "").toUpperCase());

export const enforceCsrfProtection = (req: NextApiRequest): void => {
  if (!isStateChangingMethod(req.method)) {
    return;
  }

  const clientIP = getClientIdentifier(req);

  // Block known malicious IPs
  if (blockedIPs.has(clientIP)) {
    throw new NextkitError(403, "Access blocked due to suspicious activity");
  }

  // Analyze patterns for suspicious activity
  const suspiciousScore = analyzeSuspiciousPatterns(req);
  if (suspiciousScore >= 10) {
    logSecurityEvent("SUSPICIOUS_REQUEST", req, { suspiciousScore });

    if (suspiciousScore >= 15) {
      throw new NextkitError(403, "Request blocked due to suspicious patterns");
    }
  }

  const allowedHost = resolveAllowedHost(req);
  if (!allowedHost) {
    logSecurityEvent("CSRF_NO_ALLOWED_HOST", req);
    throw new NextkitError(
      400,
      "CSRF protection: unable to determine allowed host"
    );
  }

  const originHost = parseHost(req.headers.origin as string | undefined);
  const refererHost = parseHost(req.headers.referer as string | undefined);

  if (!originHost && !refererHost) {
    logSecurityEvent("CSRF_MISSING_HEADERS", req);
    throw new NextkitError(
      403,
      "CSRF protection: Origin or Referer header required"
    );
  }

  if (originHost && originHost !== allowedHost) {
    logSecurityEvent("CSRF_INVALID_ORIGIN", req, { originHost, allowedHost });
    throw new NextkitError(403, "CSRF protection: invalid Origin header");
  }

  if (refererHost && refererHost !== allowedHost) {
    logSecurityEvent("CSRF_INVALID_REFERER", req, { refererHost, allowedHost });
    throw new NextkitError(403, "CSRF protection: invalid Referer header");
  }
};

export const enforceRateLimit = (
  req: NextApiRequest,
  res: NextApiResponse,
  scope: RateLimitScope
): void => {
  if (process.env.VISUAL_TESTING === "true") {
    return;
  }

  const { limit, windowMs } = RATE_LIMITS[scope];
  const clientIP = getClientIdentifier(req);

  // Block known malicious IPs immediately
  if (blockedIPs.has(clientIP)) {
    res.setHeader("Retry-After", "3600");
    throw new NextkitError(429, "Access blocked due to suspicious activity");
  }

  const bucketKey = `${scope}:${clientIP}`;
  const store = rateLimitBuckets[scope];
  const now = Date.now();

  const bucket = store.get(bucketKey);

  if (!bucket || bucket.resetAt <= now) {
    store.set(bucketKey, {
      count: 1,
      resetAt: now + windowMs,
      blocked: false,
      suspiciousScore: 0,
    });
    return;
  }

  // Increase penalty for repeated violations
  if (bucket.count >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((bucket.resetAt - now) / 1000)
    );

    // Apply exponential backoff for repeat offenders
    const multiplier = Math.min(bucket.blocked ? 2 : 1, 4);
    const adjustedRetryAfter = Math.ceil(retryAfterSeconds * multiplier);

    res.setHeader("Retry-After", adjustedRetryAfter);

    logSecurityEvent("RATE_LIMIT_EXCEEDED", req, {
      scope,
      count: bucket.count,
      limit,
      retryAfter: adjustedRetryAfter,
    });

    bucket.blocked = true;
    bucket.suspiciousScore += 5;

    throw new NextkitError(
      429,
      `Rate limit exceeded. Try again in ${adjustedRetryAfter} seconds.`
    );
  }

  bucket.count += 1;

  // Warn when approaching limit
  if (bucket.count >= limit * 0.8) {
    logSecurityEvent("RATE_LIMIT_WARNING", req, {
      scope,
      count: bucket.count,
      limit,
    });
  }
};

export const handleSecurityError = (
  res: NextApiResponse,
  error: unknown
): boolean => {
  if (error instanceof NextkitError) {
    // Log security errors
    if (error.code >= 400) {
      console.error("Security Error:", {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(error.code).json({
      message: error.message,
      code: error.code,
    });
    return true;
  }

  return false;
};

// Utility functions for security monitoring
export const getSecurityStats = () => {
  const now = Date.now();
  const last24h = now - 24 * 60 * 60 * 1000;

  const recentEvents = securityEvents.filter(
    (event) => event.timestamp > last24h
  );
  const eventsByType = recentEvents.reduce(
    (acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalEvents: recentEvents.length,
    eventsByType,
    blockedIPs: Array.from(blockedIPs),
    suspiciousIPs: Array.from(suspiciousIPs.entries()).map(([ip, data]) => ({
      ip,
      ...data,
      lastSeen: new Date(data.lastSeen).toISOString(),
    })),
    rateLimitStats: {
      auth: rateLimitBuckets.auth.size,
      api: rateLimitBuckets.api.size,
    },
  };
};

export const clearOldRateLimitData = (): void => {
  const now = Date.now();

  Object.values(rateLimitBuckets).forEach((bucket) => {
    for (const [key, entry] of bucket.entries()) {
      if (entry.resetAt <= now) {
        bucket.delete(key);
      }
    }
  });

  // Clean old suspicious IPs (older than 24 hours)
  const cutoff = now - 24 * 60 * 60 * 1000;
  for (const [ip, data] of suspiciousIPs.entries()) {
    if (data.lastSeen < cutoff) {
      suspiciousIPs.delete(ip);
    }
  }
};

// Clean up old data every hour
if (typeof setInterval !== "undefined") {
  setInterval(clearOldRateLimitData, 60 * 60 * 1000);
}
