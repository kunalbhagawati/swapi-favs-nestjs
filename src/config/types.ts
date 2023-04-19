import { z } from "zod";
import { appConfigSchema, swapiConfigSchema } from "./schemas";

export type AppConfig = z.infer<typeof appConfigSchema>;

export type SwapiConfig = z.infer<typeof swapiConfigSchema>;

export type Config = {
  app: AppConfig;
  swapi: SwapiConfig;
};

export type ConfigFactory = (config: Record<string, unknown>) => Config;
