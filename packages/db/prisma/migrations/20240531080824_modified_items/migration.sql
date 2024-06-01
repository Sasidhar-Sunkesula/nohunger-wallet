/*
  Warnings:

  - You are about to drop the column `cost` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `img_url` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `item_name` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Items` table. All the data in the column will be lost.
  - Added the required column `imageId` to the `Items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratings` to the `Items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Items" DROP COLUMN "cost",
DROP COLUMN "img_url",
DROP COLUMN "item_name",
DROP COLUMN "rating",
ADD COLUMN     "imageId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "ratings" DOUBLE PRECISION NOT NULL;
