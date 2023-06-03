/*
  Warnings:

  - You are about to drop the `_subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/

-- CreateTable
CREATE TABLE "subscriptions" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("followerId","followingId")
);

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Copy Data
INSERT INTO "subscriptions" ("followerId", "followingId", "createdAt", "updatedAt")
SELECT "A", "B", NOW(), NOW()
FROM "_subscriptions";

-- DropForeignKey
ALTER TABLE "_subscriptions" DROP CONSTRAINT "_subscriptions_A_fkey";

-- DropForeignKey
ALTER TABLE "_subscriptions" DROP CONSTRAINT "_subscriptions_B_fkey";

-- DropTable
DROP TABLE "_subscriptions";