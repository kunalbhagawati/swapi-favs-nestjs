import { Injectable } from "@nestjs/common";
import { ResourceType } from "../../constants";
import { SwapiConfig } from "../../config/types";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { serializeFilm, serializePlanet } from "./swapi-serializer";
import { Movie } from "../../movies/movies.types";
import { Planet } from "../../planets/planets.types";

@Injectable()
export default class SwapiRepository {
  private static readonly resourceTypeUrlPathMap = {
    [ResourceType.Movie]: "films",
    [ResourceType.Planet]: "planets",
  };

  constructor(private readonly nestConfig: ConfigService) {}

  get config(): SwapiConfig {
    return this.nestConfig.getOrThrow<SwapiConfig>("swapi");
  }

  resourcePath = (resourceType: ResourceType): string =>
    SwapiRepository.resourceTypeUrlPathMap[resourceType];

  urlPath = (resourceType: ResourceType): string =>
    `${this.config.baseUrl}/${this.resourcePath(resourceType)}`;

  getAllFilms = async () =>
    this.getAll<Movie>(ResourceType.Movie, serializeFilm);

  getAllPlanets = async () =>
    this.getAll<Planet>(ResourceType.Planet, serializePlanet);

  private getAll = async <T extends Movie | Planet>(
    resourceType: ResourceType,
    serialize: typeof serializeFilm | typeof serializePlanet,
  ): Promise<T[]> =>
    (await axios.get(this.urlPath(resourceType))).data.results.map(serialize);
}
