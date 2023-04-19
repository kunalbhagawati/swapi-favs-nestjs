import { z } from "zod";

export const appConfigSchema = z
  .object({
    APP_PORT: z.coerce.number().default(3000),
  })
  .transform(({ APP_PORT }) => ({
    port: APP_PORT,
  }));
