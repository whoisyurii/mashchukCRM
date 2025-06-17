-- AlterTable
ALTER TABLE "action_history" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "logoUrl" TEXT;

-- AddForeignKey
ALTER TABLE "action_history" ADD CONSTRAINT "action_history_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
