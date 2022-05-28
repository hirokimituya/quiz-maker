/*
  Warnings:

  - You are about to drop the column `genereId` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `genreId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_genereId_fkey";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "genereId",
ADD COLUMN     "genreId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;
