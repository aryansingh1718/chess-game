/*
  Warnings:

  - Added the required column `move` to the `Move` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Move" ADD COLUMN     "move" TEXT NOT NULL;
