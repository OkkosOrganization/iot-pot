import { relations } from "drizzle-orm/relations";
import { users, devices } from "./schema";

export const devicesRelations = relations(devices, ({one}) => ({
	user: one(users, {
		fields: [devices.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	devices: many(devices),
}));