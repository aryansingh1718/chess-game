-- DropForeignKey
ALTER TABLE "Move" DROP CONSTRAINT "Move_userId_fkey";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "winnerId" TEXT,
ALTER COLUMN "active" DROP NOT NULL,
ALTER COLUMN "active" SET DEFAULT true;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
