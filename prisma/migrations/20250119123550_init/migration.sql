-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "dash";

-- CreateEnum
CREATE TYPE "dash"."ChartType" AS ENUM ('TABLE', 'LINE', 'BAR', 'PIE', 'TREEMAP', 'NUMBER');

-- CreateEnum
CREATE TYPE "dash"."LeftRight" AS ENUM ('LEFT', 'RIGHT');

-- CreateEnum
CREATE TYPE "dash"."CustomizableChartTypes" AS ENUM ('LINE', 'BAR');

-- CreateEnum
CREATE TYPE "dash"."Tags" AS ENUM ('Stacks', 'Babo', 'NFT', 'Meme', 'PoX', 'DEFI', 'sBTC', 'Mempool', 'Ordinals', 'Mining');

-- CreateTable
CREATE TABLE "dash"."owner" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
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
    "type" "dash"."ChartType" NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "variables" JSONB[],
    "dashboard_id" INTEGER NOT NULL,
    "axes_types" "dash"."LeftRight"[],
    "column_types" "dash"."CustomizableChartTypes"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dash"."tags" (
    "id" SERIAL NOT NULL,
    "name" "dash"."Tags" NOT NULL,
    "dashboard_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "owner_address_key" ON "dash"."owner"("address");

-- CreateIndex
CREATE INDEX "USER_ADDRESS" ON "dash"."owner"("address");

-- CreateIndex
CREATE INDEX "DASH_TITLE" ON "dash"."dashboards"("deleted", "title");

-- CreateIndex
CREATE UNIQUE INDEX "dashboards_deleted_title_key" ON "dash"."dashboards"("deleted", "title");

-- CreateIndex
CREATE INDEX "CHART_DASHBOARD_ID" ON "dash"."charts"("deleted", "dashboard_id");

-- AddForeignKey
ALTER TABLE "dash"."dashboards" ADD CONSTRAINT "dashboards_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "dash"."owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dash"."charts" ADD CONSTRAINT "charts_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "dash"."dashboards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dash"."tags" ADD CONSTRAINT "tags_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "dash"."dashboards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
