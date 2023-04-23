import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { AddFavoritesDTO } from "../users/users.dto";
import { isNil } from "ramda";
import { UserId } from "../lib/user.decorator";
import UsersService from "../users/users.service";
import FavoritesService from "./favorites.service";

@Controller('favorites')
export default class FavoritesController {
  /**
   * Add a list of favorites for the user.
   */

  constructor(
    private readonly usersService: UsersService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post()
  async saveFavorites(@UserId() id: string, @Body() dto: AddFavoritesDTO) {
    const user = await this.usersService.get(id);
    if (isNil(user)) {
      throw new BadRequestException(`User with id ${id} does not exist.`);
    }

    return {
      favorites: await this.favoritesService.saveUserFavorites(
        user,
        dto.favorites,
      ),
    };
  }
}
