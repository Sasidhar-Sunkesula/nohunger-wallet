/*
  Warnings:

  - The primary key for the `Cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cost` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `ratings` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cart_itemId_key";

-- AlterTable
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_pkey",
DROP COLUMN "cost",
DROP COLUMN "image_url",
DROP COLUMN "itemId",
DROP COLUMN "name",
DROP COLUMN "ratings",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Cart_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Items" (
    "id" INTEGER NOT NULL,
    "item_name" TEXT NOT NULL,
    "img_url" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItems" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "CartItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
