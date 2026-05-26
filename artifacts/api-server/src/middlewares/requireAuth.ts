import { Request, Response, NextFunction } from "express";

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

/**
 * Parse a Supabase/JWT token without signature verification.
 * Extracts sub (user id) and email from the payload.
 * In production, replace with full JWT verification against Supabase.
 */
function parseJwt(token: string): AuthUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as {
      sub?: string;
      email?: string;
      user_metadata?: { email?: string };
    };
    const id = payload.sub;
    const email = payload.email ?? payload.user_metadata?.email;
    if (!id || !email) return null;
    return { id, email };
  } catch {
    return null;
  }
}

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "chegembugua97@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export function getRequestUser(req: Request): AuthUser | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const user = parseJwt(token);
  if (!user) return null;
  // Attach admin role based on email list
  if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    user.role = "ADMIN";
  }
  return user;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const user = getRequestUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as Request & { user: AuthUser }).user = user;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = getRequestUser(req);
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
}
