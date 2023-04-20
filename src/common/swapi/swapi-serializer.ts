import { Movie } from "../../movies/movies.types";
import { pick } from "ramda";
import { Planet } from "../../planets/planets.types";

export const serialize = <T extends Movie | Planet>(
  obj: unknown,
  elements: (keyof T)[],
): T => pick(["created", "url", ...elements], obj) as T;

export const serializeFilm = (obj: unknown) =>
  serialize<Movie>(obj, ["title", "release_date"]);

export const serializePlanet = (obj: unknown) =>
  serialize<Planet>(obj, ["name"]);
