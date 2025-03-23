-- DropForeignKey
ALTER TABLE "dash"."charts" DROP CONSTRAINT "charts_dashboard_id_fkey";

-- AlterTable
ALTER TABLE "dash"."charts" ALTER COLUMN "dashboard_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "dash"."charts" ADD CONSTRAINT "charts_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "dash"."dashboards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
