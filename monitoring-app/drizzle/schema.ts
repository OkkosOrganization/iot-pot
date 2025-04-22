import { pgTable, unique, serial, varchar, foreignKey, integer, json, timestamp, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	auth0Id: varchar("auth0_id", { length: 255 }).notNull(),
}, (table) => [
	unique("users_auth0_id_key").on(table.auth0Id),
]);

export const devices = pgTable("devices", {
	id: serial().primaryKey().notNull(),
	deviceId: varchar("device_id", { length: 255 }).notNull(),
	userId: integer("user_id"),
	title: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "devices_user_id_fkey"
		}),
	unique("devices_device_id_key").on(table.deviceId),
]);

export const measurements = pgTable("measurements", {
	id: serial().primaryKey().notNull(),
	deviceId: varchar("device_id", { length: 255 }).notNull(),
	data: json().notNull(),
	timestamp: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.deviceId],
			foreignColumns: [devices.deviceId],
			name: "measurements_device_id-devices_device_id"
		}),
]);

export const notes = pgTable("notes", {
	id: serial().primaryKey().notNull(),
	date: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	content: text(),
	deviceId: varchar("device_id", { length: 255 }).notNull(),
	title: varchar({ length: 512 }),
	image: text(),
}, (table) => [
	foreignKey({
			columns: [table.deviceId],
			foreignColumns: [devices.deviceId],
			name: "notes_device_id-devices_device_id"
		}),
]);
