-- CreateEnum
CREATE TYPE "dash"."LeftRight" AS ENUM ('LEFT', 'RIGHT');

-- CreateEnum
CREATE TYPE "dash"."CustomizableChartTypes" AS ENUM ('LINE', 'BAR');

-- AlterTable
ALTER TABLE "dash"."charts" ADD COLUMN     "axes_types" "dash"."LeftRight"[],
ADD COLUMN     "column_types" "dash"."CustomizableChartTypes"[];
