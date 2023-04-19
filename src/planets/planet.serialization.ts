import { Planet, ResponsePlanet } from "./planets.types";
import { pick } from "ramda";

export const serializeFromSWAPI = (obj: ResponsePlanet): Planet =>
  pick(["created", "name", "url"], obj);
