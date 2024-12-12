/*
  Warnings:

  - You are about to drop the column `ownerId` on the `task` table. All the data in the column will be lost.
  - Added the required column `_ownerId` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_ownerId_fkey";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "ownerId",
ADD COLUMN     "_ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task__ownerId_fkey" FOREIGN KEY ("_ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
