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

/**
 * Nestjs heavily relies on Dependency Injection and IoC.
 * This might be familiar to you if you come from Java/Spring or Angular.
 *
 * Everything is structured into modules and/or providers.
 * The whole app is a graph of dependencies.
 *
 * When we instantiate the app as a service, nestjs basically asks,
 * "okay, but what is the first DI container that will be the root node of the
 * whole DI tree?"
 * This class is that root node.
 *
 * https://docs.nestjs.com/modules
 */
@Module({
  imports: [
    // Imports modules, that brings in their own providers, etc to this module.
    // Basically "importing" a `module` makes all _it's_ stuff available to the
    // importing module to use.
    // So if `Module-A` exports something called `Provider-A` and this `Module-A`
    // is imported by `Module-B`, then `Provider-A` becomes available to
    // `Module-B`.
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: configFactory,
    }),
    HttpModule,
    RedisModule.forRootAsync({
      // Makes the above `Config` stuff available to this module.
      // Since it is not yet resolved i.e. the DI system is still building the
      // graph, we'll have to build this module asynchronously.
      // This is a fairly common convention in the nest ecosystem.
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
    // These are basically going to be instantiated by nestjs and then will be
    // made available to use to each other via constructor parameters
    // or injected properties.
    // https://docs.nestjs.com/providers
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
