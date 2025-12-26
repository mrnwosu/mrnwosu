-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "ipHash" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ContactSubmission_ipHash_idx" ON "ContactSubmission"("ipHash");

-- CreateIndex
CREATE INDEX "ContactSubmission_email_idx" ON "ContactSubmission"("email");
