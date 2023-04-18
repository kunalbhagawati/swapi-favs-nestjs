import { Favorite } from "../constants";

export type FavoriteToAdd = {
  type: Favorite;
  id: string;
  label?: string | null;
};
