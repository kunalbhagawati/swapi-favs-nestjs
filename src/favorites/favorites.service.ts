import { Injectable } from "@nestjs/common";
import { PrismaClient } from "../prisma.client";
import { FavoriteToAdd, GetUserFavoritesWhere } from "./favorites.types";
import { User, UserFavorite } from "@prisma/client";

@Injectable()
export default class FavoritesService {
  constructor(private readonly prisma: PrismaClient) {}

  async saveUserFavorites(
    user: User,
    favorites: FavoriteToAdd[],
  ): Promise<UserFavorite[]> {
    const upserts = favorites.map(({ id, type, label }) =>
      this.prisma.userFavorite.upsert({
        where: {
          user_id_favorite_identifier_favorite_type: {
            user_id: user.id,
            favorite_identifier: id,
            favorite_type: type,
          },
        },
        update: { custom_label: label },
        create: {
          user_id: user.id,
          favorite_identifier: id,
          favorite_type: type,
          custom_label: label,
        },
      }),
    );

    return this.prisma.$transaction(upserts);
  }

  async getUserFavorites(
    where: GetUserFavoritesWhere,
  ): Promise<UserFavorite[]> {
    return this.prisma.userFavorite.findMany({
      where,
    });
  }

  /** NOTE Can optimize later to this if needed. */
  // async saveUserFavorites(
  //   user: User,
  //   favorites: FavoriteToAdd[],
  // ){
  //   const toSQL = ({ id, type, label }: FavoriteToAdd) => Prisma.sql`
  //     (${user.id}, ${id}, ${type}, ${label ?? Prisma.empty})
  //   `;
  //
  //   const values = Prisma.join(favorites.map(toSQL));
  //
  //   const sql = Prisma.sql`
  //     INSERT INTO user_favorites (user_id, favorite_id, favorite_type,
  //                                 custom_label)
  //     VALUES ${values}
  //     ON CONFLICT (user_id, favorite_id, favorite_type)
  //       DO UPDATE SET custom_label = EXCLUDED.custom_label
  //     RETURNING *
  //     `;
  //
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   return this.prisma.$queryRaw<UserFavorite[]>(sql);
  // }
}
