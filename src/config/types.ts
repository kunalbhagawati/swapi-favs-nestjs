import { z } from "zod";
import { appConfigSchema } from "./schemas";

export type AppConfig = z.infer<typeof appConfigSchema>;

export type Config = {
  app: AppConfig;
};

export type ConfigFactory = (config: Record<string, unknown>) => Config;
