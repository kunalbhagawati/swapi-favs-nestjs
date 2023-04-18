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
    add constraint user_favorites_unique_favorite_id
        unique (user_id, favorite_id, favorite_type);

-- CreateIndex
create unique index if not exists user_favorites_unique_favorite_id
    on public.user_favorites (user_id, favorite_id, favorite_type);

create unique index if not exists user_favorites_unique_title
    on public.user_favorites (user_id, custom_label, favorite_type)
    where (custom_label IS NOT NULL);


-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users" ("id");

-- AddForeignKey
ALTER TABLE "user_favorites"
    ADD CONSTRAINT "user_favorites_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
