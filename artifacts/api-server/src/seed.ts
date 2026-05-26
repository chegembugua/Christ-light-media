/**
 * Seed script — run via: pnpm --filter @workspace/api-server run seed
 * Creates default chat rooms, challenges, and marks the admin user row if they exist.
 * The admin user profile is created automatically on first Supabase login via /api/auth/create-profile.
 */
import { db } from "./lib/db";
import { chatRooms, challenges, users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

// ADMIN_EMAILS must be set explicitly — no hardcoded fallback.
const ADMIN_EMAIL = process.env.ADMIN_EMAILS?.split(",")[0]?.trim();

const DEFAULT_ROOMS = [
  { name: "General", description: "Open fellowship — all are welcome here." },
  { name: "Prayer Support", description: "Lift your requests and pray with those in need." },
  { name: "Worship & Praise", description: "Celebrate God! Share testimonies, songs, and worship moments." },
  { name: "Testimony Sharing", description: "Share how God is moving in your life." },
];

const DEFAULT_CHALLENGES = [
  {
    slug: "21-day-prayer",
    title: "21-Day Prayer Challenge",
    description: "A 21-day journey of intentional prayer and fasting to deepen your walk with God.",
    duration: 21,
    category: "Prayer",
    difficulty: 2,
  },
  {
    slug: "40-day-fast",
    title: "40-Day Spiritual Fast",
    description: "A transformative 40-day journey of fasting, scripture reading, and community accountability.",
    duration: 40,
    category: "Fasting",
    difficulty: 4,
  },
  {
    slug: "7-day-worship",
    title: "7-Day Worship Immersion",
    description: "Dedicate 7 days to worship, praise, and meditation on the Word.",
    duration: 7,
    category: "Worship",
    difficulty: 1,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed chat rooms
  for (const room of DEFAULT_ROOMS) {
    const existing = await db.query.chatRooms.findFirst({ where: eq(chatRooms.name, room.name) });
    if (!existing) {
      await db.insert(chatRooms).values(room);
      console.log(`  ✓ Created chat room: ${room.name}`);
    } else {
      console.log(`  — Chat room exists: ${room.name}`);
    }
  }

  // Seed challenges
  for (const challenge of DEFAULT_CHALLENGES) {
    const existing = await db.query.challenges.findFirst({ where: eq(challenges.slug, challenge.slug) });
    if (!existing) {
      await db.insert(challenges).values(challenge);
      console.log(`  ✓ Created challenge: ${challenge.title}`);
    } else {
      console.log(`  — Challenge exists: ${challenge.title}`);
    }
  }

  // Upgrade admin user role if ADMIN_EMAILS is configured and the user already has a profile
  if (ADMIN_EMAIL) {
    const adminRow = await db.query.users.findFirst({ where: eq(users.email, ADMIN_EMAIL) });
    if (adminRow) {
      if (adminRow.role !== "ADMIN") {
        await db.update(users).set({ role: "ADMIN" }).where(eq(users.email, ADMIN_EMAIL));
        console.log(`  ✓ Upgraded ${ADMIN_EMAIL} to ADMIN role`);
      } else {
        console.log(`  — Admin user already set: ${ADMIN_EMAIL}`);
      }
    } else {
      console.log(`  ℹ Admin user (${ADMIN_EMAIL}) will get ADMIN role automatically on first login`);
    }
  } else {
    console.log("  ℹ ADMIN_EMAILS not set — skipping admin role assignment. Set ADMIN_EMAILS to configure admin access.");
  }

  console.log("✅ Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
