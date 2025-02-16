/*
  Warnings:

  - A unique constraint covering the columns `[appKey]` on the table `owner` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "dash"."TokenPrice" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "dash"."owner" ADD COLUMN     "appKey" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "owner_appKey_key" ON "dash"."owner"("appKey");
