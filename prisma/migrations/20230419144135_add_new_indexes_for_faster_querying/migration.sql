-- CreateIndex
CREATE INDEX "user_favorites_id_user_id_index" ON "user_favorites" ("id", "user_id");

-- CreateIndex
CREATE INDEX "user_favorites_user_id_custom_label_index" ON "user_favorites" ("user_id", "custom_label");
