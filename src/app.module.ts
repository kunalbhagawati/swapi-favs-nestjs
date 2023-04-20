import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configFactory from "./config";
import { PrismaClient } from "./prisma.client";
import UsersService from "./users/users.service";
import MoviesController from "./movies/movies.controller";
import MoviesService from "./movies/movies.service";
import UsersController from "./users/users.controller";
import FavoritesService from "./favorites/favorites.service";
import { HttpModule } from "@nestjs/axios";
import FavoritesRepository from "./favorites/favorites.repository";
import PlanetsController from "./planets/planets.controller";
import PlanetsService from "./planets/planets.service";
import PlanetsRepository from "./planets/planets.repository";
import MoviesRepository from "./movies/movies.repository";
import SwapiRepository from "./common/swapi/swapi-repository";
import { RedisModule } from "@liaoliaots/nestjs-redis";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: configFactory,
    }),
    HttpModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisConfig = config.getOrThrow("redis");
        return {
          readyLog: true,
          config: {
            host: redisConfig.host,
            port: redisConfig.port,
            db: redisConfig.db,
          },
        };
      },
    }),
  ],
  controllers: [UsersController, MoviesController, PlanetsController],
  providers: [
    PrismaClient,
    SwapiRepository,
    FavoritesService,
    UsersService,
    MoviesService,
    MoviesRepository,
    PlanetsService,
    PlanetsRepository,
    FavoritesRepository,
  ],
})
export class AppModule {}
