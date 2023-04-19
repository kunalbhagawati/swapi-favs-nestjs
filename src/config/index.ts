import { ConfigFactory } from "./types";
import { appConfigSchema } from "./schemas";

const configFactory: ConfigFactory = (config) => ({
  app: appConfigSchema.parse(config),
});

export default configFactory;
