import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);
export const userStatusEnum = pgEnum("user_status", [
  "pending",
  "approved",
  "rejected",
]);
export const accessRequestStatusEnum = pgEnum("access_request_status", [
  "pending",
  "approved",
  "rejected",
]);

// Users — mirrors Clerk users, stores role and access status
export const users = pgTable("users", {
  id: text("id").primaryKey(), // = Clerk userId
  email: text("email").notNull(),
  name: text("name"),
  role: userRoleEnum("role").default("user").notNull(),
  status: userStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Practitioners — all editable practitioner data
export const practitioners = pgTable("practitioners", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  nameFr: text("name_fr").notNull(),
  nameEn: text("name_en").notNull(),
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en").notNull(),
  bioFr: text("bio_fr"),
  bioEn: text("bio_en"),
  specialtiesFr: text("specialties_fr")
    .array()
    .default([])
    .notNull(),
  specialtiesEn: text("specialties_en")
    .array()
    .default([])
    .notNull(),
  conditionsFr: text("conditions_fr")
    .array()
    .default([])
    .notNull(),
  conditionsEn: text("conditions_en")
    .array()
    .default([])
    .notNull(),
  phone: text("phone"),
  email: text("email"),
  photoUrl: text("photo_url"),
  order: integer("display_order").default(0).notNull(),
  visible: boolean("visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Site content — key/value store for editable text blocks
export const siteContent = pgTable("site_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: text("updated_by"),
});

// Access requests — log of access request attempts
export const accessRequests = pgTable("access_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  email: text("email").notNull(),
  name: text("name"),
  status: accessRequestStatusEnum("status").default("pending").notNull(),
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
