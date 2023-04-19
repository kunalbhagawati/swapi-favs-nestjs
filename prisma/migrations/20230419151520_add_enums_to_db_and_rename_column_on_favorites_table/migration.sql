-- CreateEnum
CREATE TYPE "FavoriteType" AS ENUM ('Movie', 'Planet');

-- AlterTable
alter table user_favorites
    rename column favorite_id to favorite_identifier;

-- AlterTable
alter table user_favorites
    alter column favorite_type type "FavoriteType" using favorite_type::"FavoriteType";
