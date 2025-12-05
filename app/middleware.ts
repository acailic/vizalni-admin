import { NextRequest, NextResponse } from "next/server";

// Security constants
const STATE_CHANGING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getSecurityHeaders(isDevelopment: boolean) {
  const headers = {
    "X-DNS-Prefetch-Control": "off",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
  };

  // Only add HSTS in production (not for localhost development)
  if (!isDevelopment) {
    headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload";
  }

  return headers;
}

function buildCSPHeader(isDevelopment: boolean): string {
  const policies = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", "https://*.sentry.io", "https://vercel.live"],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "connect-src": ["'self'", "https://*.sentry.io", "https://api.mapbox.com"],
    "frame-src": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  // Allow unsafe-eval in development for Next.js dev tools
  if (isDevelopment) {
    policies["script-src"].push("'unsafe-eval'");
    policies["connect-src"].push("ws:", "wss:");
  } else {
    // Only add upgrade-insecure-requests in production
    policies["upgrade-insecure-requests"] = [];
  }

  return Object.entries(policies)
    .map(([directive, sources]) => directive + " " + sources.join(" "))
    .join("; ");
}

function resolveAllowedHost(request: NextRequest): string | undefined {
  const hostHeader = request.headers.get("host") ?? undefined;

  if (process.env.NEXTAUTH_URL) {
    return new URL(process.env.NEXTAUTH_URL).host;
  }

  if (process.env.PUBLIC_URL) {
    return new URL(process.env.PUBLIC_URL).host;
  }

  return hostHeader;
}

function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare
  
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return request.ip || "unknown";
}

function checkRateLimit(identifier: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const key = identifier;
  const record = rateLimitStore.get(key);

  if (!record || record.resetTime <= now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/fonts/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;
  const response = NextResponse.next();
  const allowedHost = resolveAllowedHost(request);
  
  // Skip security for static assets
  if (isStaticAsset(pathname)) {
    return response;
  }
  
  const isDevelopment = process.env.NODE_ENV === "development";
  
  // Apply security headers to all responses
  const securityHeaders = getSecurityHeaders(isDevelopment);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add CSP header unless disabled
  if (process.env.DISABLE_CSP !== "true") {
    response.headers.set("Content-Security-Policy", buildCSPHeader(isDevelopment));
  }

  // Add other security-related headers
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.set("X-Download-Options", "noopen");
  
  // Remove server information
  response.headers.delete("Server");
  response.headers.delete("X-Powered-By");

  // CSRF protection for state-changing API requests
  if (pathname.startsWith("/api/") && STATE_CHANGING_METHODS.includes(method)) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");

    // Check if request has proper origin/referer
    if (!origin && !referer) {
      return new Response(
        JSON.stringify({ 
          error: "CSRF protection: Origin or Referer header required" 
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate origin
    if (origin && allowedHost) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== allowedHost) {
          return new Response(
            JSON.stringify({ 
              error: "CSRF protection: invalid Origin header" 
            }),
            {
              status: 403,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      } catch {
        return new Response(
          JSON.stringify({ 
            error: "CSRF protection: invalid Origin URL" 
          }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Validate referer
    if (referer && allowedHost) {
      try {
        const refererUrl = new URL(referer);
        if (refererUrl.host !== allowedHost) {
          return new Response(
            JSON.stringify({ 
              error: "CSRF protection: invalid Referer header" 
            }),
            {
              status: 403,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      } catch {
        return new Response(
          JSON.stringify({ 
            error: "CSRF protection: invalid Referer URL" 
          }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Rate limiting for API endpoints
    const clientId = getClientIdentifier(request);
    const apiLimit = parseInt(process.env.API_RATE_LIMIT || "100");
    
    if (!checkRateLimit('api:' + clientId, apiLimit, FIFTEEN_MINUTES_MS)) {
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded for API requests",
          retryAfter: FIFTEEN_MINUTES_MS / 1000,
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil(FIFTEEN_MINUTES_MS / 1000)),
          },
        }
      );
    }
  }

  // Enhanced rate limiting for authentication endpoints
  if (pathname.startsWith("/api/auth/")) {
    const clientId = getClientIdentifier(request);
    const authLimit = parseInt(process.env.AUTH_RATE_LIMIT || "5");
    
    if (!checkRateLimit('auth:' + clientId, authLimit, FIFTEEN_MINUTES_MS)) {
      return new Response(
        JSON.stringify({ 
          error: "Too many authentication attempts",
          retryAfter: FIFTEEN_MINUTES_MS / 1000,
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil(FIFTEEN_MINUTES_MS / 1000)),
          },
        }
      );
    }
  }

  // Security monitoring: Log suspicious activities
  if (pathname.includes("..") || pathname.includes("%2e%2e")) {
    console.warn("Suspicious path traversal attempt:", {
      pathname,
      ip: getClientIdentifier(request),
      userAgent: request.headers.get("user-agent"),
      timestamp: new Date().toISOString(),
    });
    
    return new Response(
      JSON.stringify({ error: "Invalid path" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Check for common attack patterns
  const suspiciousHeaders = [
    "x-forwarded-host",
    "x-original-host",
    "x-rewrite-url",
  ];
  
  for (const header of suspiciousHeaders) {
    if (request.headers.get(header)) {
      console.warn("Suspicious header detected:", {
        header,
        value: request.headers.get(header),
        pathname,
        ip: getClientIdentifier(request),
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Add Access Control headers for API
  if (pathname.startsWith("/api/")) {
    if (allowedHost) {
      response.headers.set("Access-Control-Allow-Origin", allowedHost);
    }
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours
  }

  return response;
}

// Temporarily disable middleware for development
export const config = {
  matcher: [],
};
