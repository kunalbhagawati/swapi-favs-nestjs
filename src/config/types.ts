import { z } from "zod";
import {
  appConfigSchema,
  redisConfigSchema,
  swapiConfigSchema,
} from "./schemas";

export type AppConfig = z.infer<typeof appConfigSchema>;

export type SwapiConfig = z.infer<typeof swapiConfigSchema>;

export type RedisConfig = z.infer<typeof redisConfigSchema>;

export type Config = {
  app: AppConfig;
  swapi: SwapiConfig;
  redis: RedisConfig;
};

export type ConfigFactory = (config: Record<string, unknown>) => Config;
