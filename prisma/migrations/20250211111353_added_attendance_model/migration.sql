-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "totalClass" INTEGER NOT NULL DEFAULT 0,
    "classAttended" INTEGER NOT NULL DEFAULT 0,
    "UserId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
