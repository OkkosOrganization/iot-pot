-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "measurements" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" integer,
	"data" json NOT NULL,
	"timestamp" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"auth0_id" varchar(255) NOT NULL,
	"title" varchar(255),
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_auth0_id_key" UNIQUE("auth0_id"),
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"user_id" integer,
	CONSTRAINT "devices_device_id_key" UNIQUE("device_id")
);
--> statement-breakpoint
CREATE TABLE "diaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date DEFAULT CURRENT_DATE NOT NULL,
	"content" text
);
--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
*/