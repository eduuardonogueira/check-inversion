-- DropForeignKey
ALTER TABLE "Neighbor" DROP CONSTRAINT "Neighbor_host_id_fkey";

-- DropForeignKey
ALTER TABLE "query_logs" DROP CONSTRAINT "query_logs_host_id_fkey";

-- AlterTable
ALTER TABLE "query_logs" ALTER COLUMN "host_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Neighbor" ADD CONSTRAINT "Neighbor_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "Host"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "query_logs" ADD CONSTRAINT "query_logs_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "Host"("id") ON DELETE SET NULL ON UPDATE CASCADE;
