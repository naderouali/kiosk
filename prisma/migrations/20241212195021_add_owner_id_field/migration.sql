/*
  Warnings:

  - You are about to drop the column `_ownerId` on the `task` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task__ownerId_fkey";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "_ownerId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
