import { Injectable } from "@nestjs/common";
import { PrismaClient } from "../prisma.client";
import { User } from "@prisma/client";
import { isNil } from "ramda";

/**
 * Business logic actions for users related functionality.
 *
 * Entrypoint for all things on a business-logic related to users.
 * Includes commands, actions, etc.
 */
@Injectable()
export default class UsersService {
  constructor(private readonly prisma: PrismaClient) {}

  async add(id?: string): Promise<User> {
    if (isNil(id)) {
      // Create a new user with a default id.
      return this.prisma.user.create({ data: {} });
    }

    // Create if user with id does not exist, else return user.
    return this.prisma.user.upsert({
      where: { id },
      update: {},
      create: { id },
    });
  }

  async get(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
