-- CreateTable
CREATE TABLE "Restaurant" (
    "list" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "RestaurantList" (
    "resId" INTEGER NOT NULL,
    "menu" JSONB NOT NULL,

    CONSTRAINT "RestaurantList_pkey" PRIMARY KEY ("resId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_list_key" ON "Restaurant"("list");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantList_resId_key" ON "RestaurantList"("resId");
