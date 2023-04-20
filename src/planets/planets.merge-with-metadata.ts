import { Planet, PlanetWithFavoriteMetadata } from "./planets.types";
import { UserFavorite } from "@prisma/client";
import { isNil } from "ramda";

const defaultWithMetadata = (m: Planet): PlanetWithFavoriteMetadata => ({
  ...m,
  updated: null,
  is_favourite: false,
  original_name: m.name,
});

const mergeWithFav = (
  m: Planet,
  fav: UserFavorite,
): PlanetWithFavoriteMetadata => ({
  ...m,
  name: fav.custom_label ?? m.name,
  updated: fav.updated_at.toISOString(),
  is_favourite: true,
  original_name: m.name,
});

export const mergeWithFavOrDefault = (
  p: Planet,
  fav?: UserFavorite | null,
): PlanetWithFavoriteMetadata => {
  if (isNil(fav)) return defaultWithMetadata(p);
  return mergeWithFav(p, fav);
};
