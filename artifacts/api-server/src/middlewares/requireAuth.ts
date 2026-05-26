import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

const adminEmailsEnv = process.env.ADMIN_EMAILS ?? "";
if (!adminEmailsEnv) {
  console.warn(
    "[auth] ADMIN_EMAILS is not set — no user will have admin access. " +
      "Set ADMIN_EMAILS to a comma-separated list of admin email addresses."
  );
}
const ADMIN_EMAILS = adminEmailsEnv
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Build JWKS URL from SUPABASE_URL if configured
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const JWKS = supabaseUrl
  ? createRemoteJWKSet(new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`))
  : null;

// JWT_UNSECURE_FALLBACK=true must be explicitly set to allow unsigned token parsing.
// Without SUPABASE_URL, tokens are rejected in production unless this env is set.
const ALLOW_UNSECURE_FALLBACK = process.env.JWT_UNSECURE_FALLBACK === "true";

if (!JWKS) {
  if (ALLOW_UNSECURE_FALLBACK) {
    console.warn(
      "[auth] SUPABASE_URL not set and JWT_UNSECURE_FALLBACK=true — " +
        "JWT signature verification is DISABLED (development mode). " +
        "Set SUPABASE_URL to enable secure token verification."
    );
  } else {
    console.warn(
      "[auth] SUPABASE_URL not set — all authenticated requests will be rejected. " +
        "Set SUPABASE_URL for production or JWT_UNSECURE_FALLBACK=true for local dev."
    );
  }
}

/**
 * Attempt to verify a JWT using Supabase JWKS.
 * Falls back to unsigned base64 parsing when SUPABASE_URL is not configured (dev mode).
 */
async function verifyJwt(token: string): Promise<AuthUser | null> {
  if (JWKS) {
    try {
      const { payload } = await jwtVerify(token, JWKS);
      const id = payload.sub;
      const email =
        (payload.email as string | undefined) ??
        ((payload.user_metadata as Record<string, string> | undefined)?.email);
      if (!id || !email) return null;
      return { id, email };
    } catch {
      return null;
    }
  }

  // Dev fallback: parse without signature verification — only when explicitly allowed
  if (!ALLOW_UNSECURE_FALLBACK) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8")
    ) as {
      sub?: string;
      email?: string;
      exp?: number;
      user_metadata?: { email?: string };
    };
    // Enforce expiry even in dev mode
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    const id = payload.sub;
    const email = payload.email ?? payload.user_metadata?.email;
    if (!id || !email) return null;
    return { id, email };
  } catch {
    return null;
  }
}

export async function getRequestUser(req: Request): Promise<AuthUser | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const user = await verifyJwt(token);
  if (!user) return null;
  if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    user.role = "ADMIN";
  }
  return user;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  void getRequestUser(req).then((user) => {
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    (req as Request & { user: AuthUser }).user = user;
    next();
  });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  void getRequestUser(req).then((user) => {
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (user.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden: admin access required" });
      return;
    }
    (req as Request & { user: AuthUser }).user = user;
    next();
  });
}
