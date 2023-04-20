import { Injectable } from "@nestjs/common";
import FavoritesService from "../favorites/favorites.service";
import { indexBy, isNil, map, prop } from "ramda";
import { UserFavorite } from "@prisma/client";
import { ResourceType } from "../constants";
import PlanetsRepository from "./planets.repository";
import { Planet, PlanetWithFavoriteMetadata } from "./planets.types";
import { mergeWithFavOrDefault } from "./planets.merge-with-metadata";

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
      return map(mergeWithFavOrDefault, planets);
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
          favorite_type: ResourceType.Planet,
        }),
      );

    const merge = (m: Planet): PlanetWithFavoriteMetadata =>
      mergeWithFavOrDefault(m, favsMap[m.url]);

    return planets.map(merge);
  }

  private async filterSearchResultsWithFavorites(
    userId: string,
    planets: Planet[],
    search: string,
  ) {
    const favs = await this.favoritesService.getUserFavorites({
      user_id: userId,
      favorite_type: ResourceType.Planet,
      custom_label: { contains: search },
    });

    const planetsMap = indexBy(prop("url"), planets);

    return favs.map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const planet = planetsMap[f.favorite_identifier]!;
      return mergeWithFavOrDefault(planet, f);
    });
  }
}
