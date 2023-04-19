import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient as OGPrismaClient } from "@prisma/client";

@Injectable()
export class PrismaClient extends OGPrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }
}
