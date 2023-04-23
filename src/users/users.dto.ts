/** Request body representations. Allows us to validate requests.
 * NOTE Nest favours classes instead of typescript types.
 *  https://docs.nestjs.com/controllers#request-payloads
 */
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Matches,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import type { FavoriteToAdd as FavoriteToAddType } from "../favorites/favorites.types";
import { ResourceType } from "../constants";

export class CreateUserDTO {
  id: string;
}

export class FavoriteToAdd implements FavoriteToAddType {
  @IsNotEmpty()
  @IsEnum(ResourceType)
  type: ResourceType;

  @IsNotEmpty()
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
