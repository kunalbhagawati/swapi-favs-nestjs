import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configFactory from "./config";
import { PrismaClient } from "./prisma.client";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: configFactory,
    }),
  ],
  controllers: [],
  providers: [PrismaClient],
})
export class AppModule {}
