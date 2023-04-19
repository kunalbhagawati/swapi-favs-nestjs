/*
  Warnings:

  - Added the required column `updated_at` to the `user_favorites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_favorites"
    ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW();
