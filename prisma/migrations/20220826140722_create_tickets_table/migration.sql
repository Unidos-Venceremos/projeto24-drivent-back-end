-- CreateTable
CREATE TABLE "Tickets" (
    "id" SERIAL NOT NULL,
    "presential" BOOLEAN NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Tickets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tickets" ADD CONSTRAINT "Tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
