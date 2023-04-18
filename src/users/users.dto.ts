import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty, IsOptional,
  IsUUID, Matches, ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import type {FavoriteToAdd as FavoriteToAddType} from "../favorites/favorites.service.types";
import { Favorite } from "../constants";

// NOTE Nest favours classes instead of typescript types.
//  https://docs.nestjs.com/controllers#request-payloads

export class CreateUserDTO {
  id: string;
}

export class FavoriteToAdd implements FavoriteToAddType {
  @IsNotEmpty()
  @IsEnum(Favorite)
  type: Favorite;

  @IsNotEmpty()
  @IsUUID(4)
  id: string;

  // noinspection RegExpRedundantEscape
  @IsOptional()
  @Matches(/^[a-zA-Z0-9-_ \.]*$/)
  label?: string;
}

export class AddFavoritesDTO {
  @ValidateNested()
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => FavoriteToAdd)
  favorites: FavoriteToAdd[];
}
