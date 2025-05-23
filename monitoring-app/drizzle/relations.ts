import { relations } from "drizzle-orm/relations";
import { users, devices, measurements, notes, waterings } from "./schema";

export const devicesRelations = relations(devices, ({one, many}) => ({
	user: one(users, {
		fields: [devices.userId],
		references: [users.id]
	}),
	measurements: many(measurements),
	notes: many(notes),
	waterings: many(waterings),
}));

export const usersRelations = relations(users, ({many}) => ({
	devices: many(devices),
}));

export const measurementsRelations = relations(measurements, ({one}) => ({
	device: one(devices, {
		fields: [measurements.deviceId],
		references: [devices.deviceId]
	}),
}));

export const notesRelations = relations(notes, ({one}) => ({
	device: one(devices, {
		fields: [notes.deviceId],
		references: [devices.deviceId]
	}),
}));

export const wateringsRelations = relations(waterings, ({one}) => ({
	device: one(devices, {
		fields: [waterings.deviceId],
		references: [devices.deviceId]
	}),
}));