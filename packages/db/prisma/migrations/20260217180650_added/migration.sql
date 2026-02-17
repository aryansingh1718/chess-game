/*
  Warnings:

  - Made the column `active` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "blackId" TEXT,
ADD COLUMN     "whiteId" TEXT,
ALTER COLUMN "active" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Move_roomId_idx" ON "Move"("roomId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_blackId_fkey" FOREIGN KEY ("blackId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_whiteId_fkey" FOREIGN KEY ("whiteId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
