/*
  Warnings:

  - You are about to drop the column `appKey` on the `owner` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "dash"."charts" DROP CONSTRAINT "charts_dashboard_id_fkey";

-- DropIndex
DROP INDEX "dash"."owner_appKey_key";

-- AlterTable
ALTER TABLE "dash"."owner" DROP COLUMN "appKey";

-- AddForeignKey
ALTER TABLE "dash"."charts" ADD CONSTRAINT "charts_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "dash"."dashboards"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
