import { Injectable } from "@nestjs/common";
import { Movie, MovieWithFavoriteMetadata } from "./movies.types";
import MoviesRepository from "./movies.repository";
import FavoritesService from "../favorites/favorites.service";
import { indexBy, isNil, prop } from "ramda";
import { FavoriteType } from "../constants";
import { UserFavorite } from "@prisma/client";

@Injectable()
export default class MoviesService {
  constructor(
    private readonly moviesRepo: MoviesRepository,
    private readonly favoritesService: FavoritesService,
  ) {}

  async getAll(
    userId?: string,
    search?: string,
  ): Promise<MovieWithFavoriteMetadata[]> {
    const movies = await this.moviesRepo.getAll();

    if (isNil(userId)) {
      // No user sent. Send back the movies directly.
      return movies.map(this.defaultMovieDTO);
    }

    return this.syncWithUserFavorites(userId, movies, search);
  }

  private async syncWithUserFavorites(
    userId: string,
    movies: Movie[],
    search?: string,
  ): Promise<MovieWithFavoriteMetadata[]> {
    if (isNil(search)) {
      // No search term sent.
      // Send back data merged with user favorites metadata.
      return this.mergeAllWithFavorites(userId, movies);
    }

    return this.filterSearchResultsWithFavorites(userId, movies, search);
  }

  private async mergeAllWithFavorites(
    userId: string,
    movies: Movie[],
  ): Promise<MovieWithFavoriteMetadata[]> {
    const favsMap: Record<UserFavorite["favorite_identifier"], UserFavorite> =
      indexBy(
        prop("favorite_identifier"),
        await this.favoritesService.getUserFavorites({
          user_id: userId,
          favorite_type: FavoriteType.Movie,
        }),
      );

    const merge = (m: Movie): MovieWithFavoriteMetadata =>
      this.mergeWithFavOrDefault(m, favsMap[m.url]);

    return movies.map(merge);
  }

  private async filterSearchResultsWithFavorites(
    userId: string,
    movies: Movie[],
    search: string,
  ) {
    const favs = await this.favoritesService.getUserFavorites({
      user_id: userId,
      favorite_type: FavoriteType.Movie,
      custom_label: { contains: search },
    });

    const moviesMap = indexBy(prop("url"), movies);

    return favs.map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const movie = moviesMap[f.favorite_identifier]!;
      return this.mergeWithFav(movie, f);
    });
  }

  private defaultMovieDTO = (m: Movie): MovieWithFavoriteMetadata => ({
    ...m,
    updated: null,
    is_favourite: false,
    original_title: m.title,
  });

  private mergeWithFav = (
    m: Movie,
    fav: UserFavorite,
  ): MovieWithFavoriteMetadata => ({
    ...m,
    title: fav.custom_label ?? m.title,
    updated: fav.updated_at.toISOString(),
    is_favourite: true,
    original_title: m.title,
  });

  private mergeWithFavOrDefault = (
    m: Movie,
    fav?: UserFavorite | null,
  ): MovieWithFavoriteMetadata => {
    if (isNil(fav)) return this.defaultMovieDTO(m);
    return this.mergeWithFav(m, fav);
  };
}
