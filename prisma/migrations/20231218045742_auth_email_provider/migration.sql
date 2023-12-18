/*
  Warnings:

  - You are about to drop the `charts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashboards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "dash";

-- CreateEnum
CREATE TYPE "dash"."ChartType" AS ENUM ('TABLE', 'LINE', 'BAR', 'PIE', 'TREEMAP', 'NUMBER');

-- DropForeignKey
ALTER TABLE "public"."charts" DROP CONSTRAINT "charts_dashboard_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."dashboards" DROP CONSTRAINT "dashboards_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tags" DROP CONSTRAINT "tags_dashboard_id_fkey";

-- DropTable
DROP TABLE "public"."charts";

-- DropTable
DROP TABLE "public"."dashboards";

-- DropTable
DROP TABLE "public"."tags";

-- DropTable
DROP TABLE "public"."users";

-- DropEnum
DROP TYPE "public"."ChartType";

-- CreateTable
CREATE TABLE "dash"."owner" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dash"."dashboards" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "owner_id" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dash"."charts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "variables" TEXT[],
    "type" "dash"."ChartType" NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "dashboard_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dash"."tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dashboard_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "owner_email_key" ON "dash"."owner"("email");

-- CreateIndex
CREATE INDEX "USER_EMAIL" ON "dash"."owner"("email");

-- CreateIndex
CREATE INDEX "DASH_TITLE" ON "dash"."dashboards"("deleted", "title");

-- CreateIndex
CREATE UNIQUE INDEX "dashboards_deleted_title_key" ON "dash"."dashboards"("deleted", "title");

-- CreateIndex
CREATE INDEX "CHART_DASHBOARD_ID" ON "dash"."charts"("deleted", "dashboard_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "dash"."tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "dash"."dashboards" ADD CONSTRAINT "dashboards_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "dash"."owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dash"."charts" ADD CONSTRAINT "charts_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "dash"."dashboards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dash"."tags" ADD CONSTRAINT "tags_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "dash"."dashboards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
