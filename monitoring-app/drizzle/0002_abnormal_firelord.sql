ALTER TABLE "measurements" ALTER COLUMN "device_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "measurements" ALTER COLUMN "device_id" SET NOT NULL;