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

export const redisConfigSchema = z
  .object({
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number().default(6379),
  })
  .transform(({ REDIS_HOST, REDIS_PORT }) => ({
    host: REDIS_HOST,
    port: REDIS_PORT,
  }));
