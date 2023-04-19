import { Injectable } from "@nestjs/common";
import { Movie, MovieDTO } from "./movies.types";
import MoviesRepository from "./movies.repository";
import FavoritesService from "../favorites/favorites.service";
import { indexBy, isNil } from "ramda";
import { FavoriteType } from "../constants";

@Injectable()
export default class MoviesService {
  constructor(
    private readonly moviesRepo: MoviesRepository,
    private readonly favoritesService: FavoritesService,
  ) {
  }

  async getAll(userId?: string): Promise<MovieDTO[]> {
    const movies = await this.moviesRepo.getAll();

    if (!isNil(userId)) {
      return this.mergeWithFavorites(userId, movies);
    }

    return movies.map(this.defaultMovieDTO);
  }

  private async mergeWithFavorites(
    userId: string,
    movies: Movie[],
  ): Promise<MovieDTO[]> {
    const favsMap = indexBy(
      (f) => f.favorite_identifier,
      await this.favoritesService.getUserFavorites({
        user_id: userId,
        favorite_type: FavoriteType.Movie,
      }),
    );

    const merge = (m: Movie): MovieDTO => {
      const f = favsMap[m.url];

      if (isNil(f)) return this.defaultMovieDTO(m);

      return {
        ...m,
        title: f.custom_label ?? m.title,
        updated: null, // TODO this must use something to reference it.
        is_favourite: true,
      };
    };

    return movies.map(merge);
  }

  private defaultMovieDTO = (m: Movie): MovieDTO => ({
    ...m,
    updated: null,
    is_favourite: false,
  });
}
