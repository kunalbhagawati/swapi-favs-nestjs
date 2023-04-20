import { Movie, MovieWithFavoriteMetadata } from "./movies.types";
import { UserFavorite } from "@prisma/client";
import { isNil } from "ramda";

const defaultWithMetadata = (m: Movie): MovieWithFavoriteMetadata => ({
  ...m,
  updated: null,
  is_favourite: false,
  original_title: m.title,
});

const mergeWithFav = (
  m: Movie,
  fav: UserFavorite,
): MovieWithFavoriteMetadata => ({
  ...m,
  title: fav.custom_label ?? m.title,
  updated: fav.updated_at.toISOString(),
  is_favourite: true,
  original_title: m.title,
});

export const mergeWithFavOrDefault = (
  m: Movie,
  fav?: UserFavorite | null,
): MovieWithFavoriteMetadata => {
  if (isNil(fav)) return defaultWithMetadata(m);
  return mergeWithFav(m, fav);
};
