/*
  Warnings:

  - A unique constraint covering the columns `[hostname]` on the table `Host` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Host_ip_key";

-- CreateIndex
CREATE UNIQUE INDEX "Host_hostname_key" ON "Host"("hostname");
