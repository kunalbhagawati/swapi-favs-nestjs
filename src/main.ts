import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaClient } from "./prisma.client";
import { ConfigService } from "@nestjs/config";
import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";

const logger = new Logger();

// Serialize Prisma `BigInt` to string
declare global {
  // noinspection JSUnusedGlobalSymbols
  interface BigInt {
    toJSON(): string;
  }
}

// noinspection JSUnusedGlobalSymbols
BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

// ---

const configure = async (app: INestApplication) => {
  const prisma = app.get(PrismaClient);
  await prisma.enableShutdownHooks(app);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  await configure(app);
  const port = config.getOrThrow<number>("app.port");

  logger.log(`Running app on port ${port}`);
  await app.listen(port);
}

bootstrap();
