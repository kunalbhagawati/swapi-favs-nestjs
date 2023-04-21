import { Injectable } from "@nestjs/common";
import { ResourceType } from "../constants";
import { SwapiConfig } from "../config/types";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { serializeFilm, serializePlanet } from "./swapi.serializer";
import { Movie } from "../movies/movies.types";
import { Planet } from "../planets/planets.types";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { isEmpty, isNil, map, reduce, values } from "ramda";

@Injectable()
export default class SwapiRepository {
  private static readonly resourceTypeUrlPathMap = {
    [ResourceType.Movie]: "films",
    [ResourceType.Planet]: "planets",
  };

  private static readonly resourceTypeRedisKeyMap = {
    [ResourceType.Movie]: "resources::films",
    [ResourceType.Planet]: "resources::planets",
  };

  private static readonly resourceTypeSerializerFunction = {
    [ResourceType.Movie]: serializeFilm,
    [ResourceType.Planet]: serializePlanet,
  };

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly nestConfig: ConfigService,
  ) {}

  get config(): SwapiConfig {
    return this.nestConfig.getOrThrow<SwapiConfig>("swapi");
  }

  resourcePath = (resourceType: ResourceType): string =>
    SwapiRepository.resourceTypeUrlPathMap[resourceType];

  urlPath = (resourceType: ResourceType): string =>
    `${this.config.baseUrl}/${this.resourcePath(resourceType)}`;

  getAllFilms = async () => this.fetchUsingCache<Movie>(ResourceType.Movie);

  getAllPlanets = async () => this.fetchUsingCache<Planet>(ResourceType.Planet);

  private fetchUsingCache = async <T extends Movie | Planet>(
    resourceType: ResourceType,
  ): Promise<T[]> => {
    const res = await this.redis.hgetall(this.redisKey(resourceType));

    if (!isNil(res) && !isEmpty(res)) {
      return map(this.decodeFromRedis, values(res)) as T[];
    }

    return this.fetchFromAPIAndWriteThrough<T>(resourceType);
  };

  private fetchFromAPIAndWriteThrough = async <T extends Movie | Planet>(
    resourceType: ResourceType,
  ) => {
    const res = await this.getAll<T>(
      resourceType,
      SwapiRepository.resourceTypeSerializerFunction[resourceType],
    );

    await this.redis.hmset(
      this.redisKey(resourceType),
      reduce(
        (acc, value: T) => ({ ...acc, [value.url]: this.encodeToRedis(value) }),
        {},
        res,
      ),
    );
    this.redis.expire(this.redisKey(resourceType), 60 * 60);
    return res;
  };

  private redisKey = (resourceType: ResourceType): string =>
    SwapiRepository.resourceTypeRedisKeyMap[resourceType];

  private encodeToRedis = (r: unknown): string => JSON.stringify(r);
  private decodeFromRedis = (r: string): unknown => JSON.parse(r);

  private getAll = async <T extends Movie | Planet>(
    resourceType: ResourceType,
    serialize: typeof serializeFilm | typeof serializePlanet,
  ): Promise<T[]> =>
    (await axios.get(this.urlPath(resourceType))).data.results.map(serialize);
}
