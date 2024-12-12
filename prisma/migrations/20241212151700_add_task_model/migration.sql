-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "state" TEXT NOT NULL DEFAULT 'TODO',
    "owner" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);
