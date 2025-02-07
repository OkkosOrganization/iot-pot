ALTER TABLE "diaries" RENAME TO "notes";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_key";--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "title" varchar(255);--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "device_id" integer;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_devices_id_fkey" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_device_id_key" UNIQUE("device_id");