-- AlterTable
ALTER TABLE "dash"."owner" ADD COLUMN     "tokens" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "dash"."TokenPrice" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "TokenPrice_pkey" PRIMARY KEY ("id")
);
