-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
