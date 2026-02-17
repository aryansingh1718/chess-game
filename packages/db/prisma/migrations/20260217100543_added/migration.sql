/*
  Warnings:

  - Added the required column `available` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "available" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "_roomPlayers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_roomPlayers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_roomPlayers_B_index" ON "_roomPlayers"("B");

-- AddForeignKey
ALTER TABLE "_roomPlayers" ADD CONSTRAINT "_roomPlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roomPlayers" ADD CONSTRAINT "_roomPlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
