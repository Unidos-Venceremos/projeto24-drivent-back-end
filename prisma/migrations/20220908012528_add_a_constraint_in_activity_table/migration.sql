/*
  Warnings:

  - A unique constraint covering the columns `[localId,startsAt,endsAt]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Activity_localId_startsAt_endsAt_key" ON "Activity"("localId", "startsAt", "endsAt");
