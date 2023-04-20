import { Injectable } from "@nestjs/common";
import FavoritesService from "../favorites/favorites.service";
import { indexBy, isNil, prop } from "ramda";
import { UserFavorite } from "@prisma/client";
import { FavoriteType } from "../constants";
import PlanetsRepository from "./planets.repository";
import { Planet, PlanetWithFavoriteMetadata } from "./planets.types";

@Injectable()
export default class PlanetsService {
  constructor(
    private readonly planetsRepo: PlanetsRepository,
    private readonly favoritesService: FavoritesService,
  ) {}

  async getAll(
    userId?: string,
    search?: string,
  ): Promise<PlanetWithFavoriteMetadata[]> {
    const planets = await this.planetsRepo.getAll();

    if (isNil(userId)) {
      // No user sent. Send back the planets directly.
      return planets.map(this.defaultPlanetDTO);
    }

    return this.syncWithUserFavorites(userId, planets, search);
  }

  private async syncWithUserFavorites(
    userId: string,
    planets: Planet[],
    search?: string,
  ): Promise<PlanetWithFavoriteMetadata[]> {
    if (isNil(search)) {
      // No search term sent.
      // Send back data merged with user favorites metadata.
      return this.mergeAllWithFavorites(userId, planets);
    }

    return this.filterSearchResultsWithFavorites(userId, planets, search);
  }

  private async mergeAllWithFavorites(
    userId: string,
    planets: Planet[],
  ): Promise<PlanetWithFavoriteMetadata[]> {
    const favsMap: Record<UserFavorite["favorite_identifier"], UserFavorite> =
      indexBy(
        prop("favorite_identifier"),
        await this.favoritesService.getUserFavorites({
          user_id: userId,
          favorite_type: FavoriteType.Planet,
        }),
      );

    const merge = (m: Planet): PlanetWithFavoriteMetadata =>
      this.mergeWithFavOrDefault(m, favsMap[m.url]);

    return planets.map(merge);
  }

  private async filterSearchResultsWithFavorites(
    userId: string,
    planets: Planet[],
    search: string,
  ) {
    const favs = await this.favoritesService.getUserFavorites({
      user_id: userId,
      favorite_type: FavoriteType.Planet,
      custom_label: { contains: search },
    });

    const planetsMap = indexBy(prop("url"), planets);

    return favs.map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const planet = planetsMap[f.favorite_identifier]!;
      return this.mergeWithFav(planet, f);
    });
  }

  private defaultPlanetDTO = (p: Planet): PlanetWithFavoriteMetadata => ({
    ...p,
    updated: null,
    is_favourite: false,
    original_name: p.name,
  });

  private mergeWithFav = (
    p: Planet,
    fav: UserFavorite,
  ): PlanetWithFavoriteMetadata => ({
    ...p,
    name: fav.custom_label ?? p.name,
    updated: fav.updated_at.toISOString(),
    is_favourite: true,
    original_name: p.name,
  });

  private mergeWithFavOrDefault = (
    p: Planet,
    fav?: UserFavorite | null,
  ): PlanetWithFavoriteMetadata => {
    if (isNil(fav)) return this.defaultPlanetDTO(p);
    return this.mergeWithFav(p, fav);
  };
}
