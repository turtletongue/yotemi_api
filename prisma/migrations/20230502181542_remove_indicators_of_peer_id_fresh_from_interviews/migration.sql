/*
  Warnings:

  - You are about to drop the column `isCreatorPeerFresh` on the `interviews` table. All the data in the column will be lost.
  - You are about to drop the column `isParticipantPeerFresh` on the `interviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "interviews" DROP COLUMN "isCreatorPeerFresh",
DROP COLUMN "isParticipantPeerFresh";
