-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "estimatedWait" INTEGER,
ADD COLUMN     "slotEndTime" TEXT,
ADD COLUMN     "slotStartTime" TEXT;
