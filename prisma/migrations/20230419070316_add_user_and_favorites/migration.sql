-- CreateTable
CREATE TABLE "user_favorites"
(
    "id"            SERIAL NOT NULL,
    "user_id"       UUID   NOT NULL,
    "favorite_id"   TEXT   NOT NULL,
    "favorite_type" TEXT   NOT NULL,
    "custom_label"  TEXT,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users"
(
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Constraint
alter table public.user_favorites
    add constraint user_favorites_unique
        unique (user_id, favorite_id, favorite_type);

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_unique" ON "user_favorites" ("user_id", "favorite_id", "favorite_type");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users" ("id");

-- AddForeignKey
ALTER TABLE "user_favorites"
    ADD CONSTRAINT "user_favorites_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
