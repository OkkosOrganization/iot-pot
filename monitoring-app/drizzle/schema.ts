import {
  pgTable,
  serial,
  integer,
  json,
  timestamp,
  unique,
  varchar,
  date,
  text,
  foreignKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const measurements = pgTable("measurements", {
  id: serial().primaryKey().notNull(),
  deviceId: integer("device_id"),
  data: json().notNull(),
  timestamp: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
});

export const users = pgTable(
  "users",
  {
    id: serial().primaryKey().notNull(),
    auth0Id: varchar("auth0_id", { length: 255 }).notNull(),
  },
  (table) => [unique("users_auth0_id_key").on(table.auth0Id)]
);

export const notes = pgTable(
  "notes",
  {
    id: serial().primaryKey().notNull(),
    date: date()
      .default(sql`CURRENT_DATE`)
      .notNull(),
    content: text(),
    deviceId: integer("device_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.deviceId],
      foreignColumns: [devices.id],
      name: "notes_devices_id_fkey",
    }),
    unique("notes_device_id_key").on(table.deviceId),
  ]
);

export const devices = pgTable(
  "devices",
  {
    id: serial().primaryKey().notNull(),
    deviceId: varchar("device_id", { length: 255 }).notNull(),
    userId: integer("user_id"),
    title: varchar({ length: 255 }),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "devices_user_id_fkey",
    }),
    unique("devices_device_id_key").on(table.deviceId),
  ]
);
