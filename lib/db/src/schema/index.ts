import {
  pgTable, text, boolean, integer, timestamp,
  uniqueIndex, pgEnum, json,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const roleEnum = pgEnum("role", ["USER", "ADMIN", "MODERATOR"]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: roleEnum("role").notNull().default("USER"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  location: text("location"),
  preferences: json("preferences"),
  isBioComplete: boolean("is_bio_complete").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ createdAt: true, updatedAt: true });
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// ─── Media ────────────────────────────────────────────────────────────────────

export const podcastShows = pgTable("podcast_shows", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  category: text("category"),
});

export const media = pgTable("media", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  speaker: text("speaker").notNull().default(""),
  coverImage: text("cover_image").notNull().default(""),
  audioUrl: text("audio_url").notNull().default(""),
  videoUrl: text("video_url"),
  type: text("type").notNull().default("SERMON"),
  category: text("category").notNull().default(""),
  duration: text("duration"),
  playCount: integer("play_count").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  podcastShowId: text("podcast_show_id").references(() => podcastShows.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMediaSchema = createInsertSchema(media).omit({ createdAt: true, updatedAt: true, playCount: true });
export type Media = typeof media.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;

// ─── Devotions ────────────────────────────────────────────────────────────────

export const devotions = pgTable("devotions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  verse: text("verse").notNull().default(""),
  verseText: text("verse_text"),
  reflection: text("reflection").notNull().default(""),
  date: timestamp("date").notNull().defaultNow(),
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDevotionSchema = createInsertSchema(devotions).omit({ createdAt: true, updatedAt: true });
export type Devotion = typeof devotions.$inferSelect;
export type InsertDevotion = z.infer<typeof insertDevotionSchema>;

// ─── News / Articles ─────────────────────────────────────────────────────────

export const newsArticles = pgTable("news_articles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  coverImage: text("cover_image").notNull().default(""),
  category: text("category").notNull().default("General"),
  author: text("author"),
  isPublished: boolean("is_published").notNull().default(false),
  isFeature: boolean("is_feature").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNewsSchema = createInsertSchema(newsArticles).omit({ createdAt: true, updatedAt: true, viewCount: true });
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

// ─── Prayer Requests ─────────────────────────────────────────────────────────

export const prayerRequests = pgTable("prayer_requests", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isAnswered: boolean("is_answered").notNull().default(false),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(true),
  duration: text("duration"),
  prayerCount: integer("prayer_count").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const prayerVotes = pgTable("prayer_votes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  prayerRequestId: text("prayer_request_id").notNull().references(() => prayerRequests.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [uniqueIndex("prayer_votes_user_prayer_idx").on(t.userId, t.prayerRequestId)]);

export const insertPrayerRequestSchema = createInsertSchema(prayerRequests).omit({
  createdAt: true, updatedAt: true, prayerCount: true, viewCount: true,
});
export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type InsertPrayerRequest = z.infer<typeof insertPrayerRequestSchema>;

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;

// ─── Chat ─────────────────────────────────────────────────────────────────────

export const chatRooms = pgTable("chat_rooms", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roomId: text("room_id").notNull().references(() => chatRooms.id, { onDelete: "cascade" }),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ChatRoom = typeof chatRooms.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

// ─── Movement / Challenges ────────────────────────────────────────────────────

export const movementMembers = pgTable("movement_members", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  challengeDay: integer("challenge_day").notNull().default(0),
  totalChallengesCompleted: integer("total_challenges_completed").notNull().default(0),
});

export const challenges = pgTable("challenges", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  duration: integer("duration").notNull().default(21),
  category: text("category").notNull().default("General"),
  difficulty: integer("difficulty").notNull().default(3),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const challengeEnrollments = pgTable("challenge_enrollments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  challengeId: text("challenge_id").notNull().references(() => challenges.id, { onDelete: "cascade" }),
  movementMemberId: text("movement_member_id").references(() => movementMembers.id, { onDelete: "set null" }),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  daysCompleted: json("days_completed").$type<number[]>().notNull().default([]),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
}, (t) => [uniqueIndex("challenge_enrollments_user_challenge_idx").on(t.userId, t.challengeId)]);

// ─── Testimonies ─────────────────────────────────────────────────────────────

export const testimonies = pgTable("testimonies", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("General"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  reactionCount: integer("reaction_count").notNull().default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Radio Schedule ───────────────────────────────────────────────────────────

export const radioSchedules = pgTable("radio_schedules", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  host: text("host"),
  type: text("type"),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  dayOfWeek: integer("day_of_week").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many, one }) => ({
  prayerRequests: many(prayerRequests),
  prayerVotes: many(prayerVotes),
  notifications: many(notifications),
  chatMessages: many(chatMessages),
  challengeEnrollments: many(challengeEnrollments),
  testimonies: many(testimonies),
  movement: one(movementMembers, { fields: [users.id], references: [movementMembers.userId] }),
}));

export const prayerRequestsRelations = relations(prayerRequests, ({ one, many }) => ({
  user: one(users, { fields: [prayerRequests.userId], references: [users.id] }),
  votes: many(prayerVotes),
}));

export const prayerVotesRelations = relations(prayerVotes, ({ one }) => ({
  user: one(users, { fields: [prayerVotes.userId], references: [users.id] }),
  prayerRequest: one(prayerRequests, { fields: [prayerVotes.prayerRequestId], references: [prayerRequests.id] }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, { fields: [chatMessages.userId], references: [users.id] }),
  room: one(chatRooms, { fields: [chatMessages.roomId], references: [chatRooms.id] }),
}));

export const chatRoomsRelations = relations(chatRooms, ({ many }) => ({
  messages: many(chatMessages),
}));

export const movementMembersRelations = relations(movementMembers, ({ one, many }) => ({
  user: one(users, { fields: [movementMembers.userId], references: [users.id] }),
  challengeEnrollments: many(challengeEnrollments),
}));

export const challengeEnrollmentsRelations = relations(challengeEnrollments, ({ one }) => ({
  user: one(users, { fields: [challengeEnrollments.userId], references: [users.id] }),
  challenge: one(challenges, { fields: [challengeEnrollments.challengeId], references: [challenges.id] }),
}));

export const testimoniesRelations = relations(testimonies, ({ one }) => ({
  user: one(users, { fields: [testimonies.userId], references: [users.id] }),
}));
