import { User } from '@prisma/client';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

/**
 * Server-side utility for protecting API routes.
 * Ensures the requester has an active session and the ADMIN role in the database.
 */
export async function requireAdmin(request?: Request): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== 'ADMIN') {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error in requireAdmin check:', error);
    return null;
  }
}
