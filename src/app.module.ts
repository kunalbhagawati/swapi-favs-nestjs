import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configFactory from "./config";
import { PrismaClient } from "./prisma.client";
import UsersService from "./users/users.service";
import MoviesController from "./movies/movies.controller";
import MoviesService from "./movies/movies.service";
import UsersController from "./users/users.controller";
import FavoritesService from "./favorites/favorites.service";
import { HttpModule } from "@nestjs/axios";
import PlanetsController from "./planets/planets.controller";
import PlanetsService from "./planets/planets.service";
import PlanetsRepository from "./planets/planets.repository";
import MoviesRepository from "./movies/movies.repository";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: configFactory,
    }),
    HttpModule,
  ],
  controllers: [UsersController, MoviesController, PlanetsController],
  providers: [
    PrismaClient,
    FavoritesService,
    UsersService,
    MoviesService,
    MoviesRepository,
    PlanetsService,
    PlanetsRepository,
  ],
})
export class AppModule {}
