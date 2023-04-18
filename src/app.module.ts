import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configFactory from "./config";
import { PrismaClient } from "./prisma.client";
import { UsersService } from "./users/users.service";
import UsersController from "./users/users.controller";
import FavoritesService from "./favorites/favorites.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: configFactory,
    }),
  ],
  controllers: [UsersController],
  providers: [PrismaClient, FavoritesService, UsersService],
})
export class AppModule {}
