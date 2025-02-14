ALTER TABLE "notes" DROP CONSTRAINT "notes_devices_id_fkey";
--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_devices_id_fkey" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("device_id") ON DELETE no action ON UPDATE no action;