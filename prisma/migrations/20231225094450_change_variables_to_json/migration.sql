/*
  Warnings:

  - The `variables` column on the `charts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `name` on the `tags` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "dash"."Tags" AS ENUM ('Stacks', 'Babo', 'NFT', 'DEFI', 'sBTC', 'Mempool', 'Ordinals', 'Mining');

-- DropIndex
DROP INDEX "dash"."tags_name_key";

-- AlterTable
ALTER TABLE "dash"."charts" DROP COLUMN "variables",
ADD COLUMN     "variables" JSONB[];

-- AlterTable
ALTER TABLE "dash"."tags" DROP COLUMN "name",
ADD COLUMN     "name" "dash"."Tags" NOT NULL;
