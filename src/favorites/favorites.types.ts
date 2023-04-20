import { Prisma as P } from ".prisma/client";
import type { FavoriteType } from "@prisma/client";

export type FavoriteToAdd = {
  type: FavoriteType;
  id: string;
  label?: string | null;
};

export type GetUserFavoritesWhere = Required<
  Pick<P.UserFavoriteWhereInput, "user_id">
> &
  Pick<P.UserFavoriteWhereInput, "favorite_type" | "custom_label">
