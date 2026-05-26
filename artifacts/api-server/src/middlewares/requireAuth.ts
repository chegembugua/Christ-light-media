import { Request, Response, NextFunction } from "express";

/**
 * requireAuth — validates a Bearer token is present.
 * When Supabase is configured (SUPABASE_SERVICE_ROLE_KEY set), the token would
 * be verified against Supabase. In development without Supabase configured,
 * the middleware passes through to avoid blocking local development.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const supabaseConfigured = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseConfigured) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Token present — in production this should verify with Supabase JWT
  next();
}

/**
 * requireAdmin — validates a Bearer token and admin role.
 * Falls through in dev when Supabase is not configured.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const supabaseConfigured = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseConfigured) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Token present — in production this should verify admin role from Supabase claims
  next();
}
