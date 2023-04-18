import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import FavoritesService from "../favorites/favorites.service";
import { AddFavoritesDTO, CreateUserDTO } from "./users.dto";
import UsersService from "./users.service";
import { isNil } from "ramda";

@Controller("users")
export default class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post("/")
  async addUser(@Body() dto: CreateUserDTO) {
    return { user: await this.usersService.add(dto.id) };
  }

  @Post("/:id/favorites")
  async saveFavorites(@Param("id") id: string, @Body() dto: AddFavoritesDTO) {
    const user = await this.usersService.get(id);
    if (isNil(user)) {
      throw new BadRequestException(`User with id ${id} does not exist.`);
    }

    return {
      favorites: await this.favoritesService.saveUserFavorites(user, dto.favorites),
    };
  }
}
