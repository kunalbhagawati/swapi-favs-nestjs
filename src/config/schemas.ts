import { z } from "zod";

export const appConfigSchema = z
  .object({
    APP_PORT: z.coerce.number().default(3000),
  })
  .transform(({ APP_PORT }) => ({
    port: APP_PORT,
  }));

export const swapiConfigSchema = z
  .object({
    SWAPI_BASE_URL: z.string(),
  })
  .transform(({ SWAPI_BASE_URL }) => ({
    baseUrl: SWAPI_BASE_URL,
  }));
