import { Movie, ResponseFilm } from "./movies.types";
import { pick } from "ramda";

export const serializeFromSWAPI = (obj: ResponseFilm): Movie =>
  pick(["created", "release_date", "title", "url"], obj);
