/*
  Warnings:

  - You are about to drop the column `bedroomId` on the `Enrollment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_bedroomId_fkey";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "bedroomId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bedroomId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bedroomId_fkey" FOREIGN KEY ("bedroomId") REFERENCES "Bedroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
