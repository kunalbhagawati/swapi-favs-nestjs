import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient as OGPrismaClient } from "@prisma/client";

@Injectable()
export class PrismaClient extends OGPrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaClient.name);

  async onModuleInit() {
    this.logger.log("Connecting to DB");
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }
}
