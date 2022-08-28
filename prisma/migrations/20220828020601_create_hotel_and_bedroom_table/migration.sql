-- CreateEnum
CREATE TYPE "typesRoom" AS ENUM ('SINGLE', 'DOUBLE', 'TRIPLE');

-- CreateTable
CREATE TABLE "Hotel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "singleAccommodation" BOOLEAN NOT NULL DEFAULT true,
    "doubleAccommodation" BOOLEAN NOT NULL DEFAULT true,
    "tripleAccommodation" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bedroom" (
    "id" SERIAL NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "enrollmentId" INTEGER,
    "typeRoom" "typesRoom" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bedroom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_name_key" ON "Hotel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Bedroom_enrollmentId_key" ON "Bedroom"("enrollmentId");

-- AddForeignKey
ALTER TABLE "Bedroom" ADD CONSTRAINT "Bedroom_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
