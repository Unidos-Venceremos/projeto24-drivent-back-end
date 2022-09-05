/*
  Warnings:

  - You are about to drop the column `enrollmentId` on the `Bedroom` table. All the data in the column will be lost.
  - Added the required column `number` to the `Bedroom` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Bedroom_enrollmentId_key";

-- AlterTable
ALTER TABLE "Bedroom" DROP COLUMN "enrollmentId",
ADD COLUMN     "number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "bedroomId" INTEGER DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_bedroomId_fkey" FOREIGN KEY ("bedroomId") REFERENCES "Bedroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
