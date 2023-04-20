import { Injectable } from "@nestjs/common";
import { FavoriteToAdd, GetUserFavoritesWhere } from "./favorites.types";
import { User, UserFavorite } from "@prisma/client";
import FavoritesRepository from "./favorites.repository";

@Injectable()
export default class FavoritesService {
  constructor(private readonly repo: FavoritesRepository) {
  }

  saveUserFavorites = async (
    user: User,
    favorites: FavoriteToAdd[],
  ): Promise<UserFavorite[]> => this.repo.upsertFavsForUser(user, favorites);

  getUserFavorites = async (
    where: GetUserFavoritesWhere,
  ): Promise<UserFavorite[]> => this.repo.getUserFavorites(where);
}
