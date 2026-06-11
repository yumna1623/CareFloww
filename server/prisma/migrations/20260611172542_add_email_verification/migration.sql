-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "verificationToken" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationToken" TEXT;
