import { Movie } from "./movies.types";
import { ResponseFilm } from "./movies.repository.types";
import { pick } from "ramda";

export const serializeFromSWAPI = (obj: ResponseFilm): Movie =>
  pick(["created", "release_date", "title", "url"], obj);
