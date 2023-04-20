import { ConfigFactory } from "./types";
import {
  appConfigSchema,
  redisConfigSchema,
  swapiConfigSchema,
} from "./schemas";
import { ZodEffects } from "zod";
import { ZodTypeAny } from "zod/lib/types";

const configFactory: ConfigFactory = (config) => {
  const p = (schema: ZodEffects<ZodTypeAny>) => schema.parse(config);

  return {
    app: p(appConfigSchema),
    swapi: p(swapiConfigSchema),
    redis: p(redisConfigSchema),
  };
};

export default configFactory;
