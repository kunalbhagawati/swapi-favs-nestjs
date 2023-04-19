import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configFactory from "./config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: configFactory,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
