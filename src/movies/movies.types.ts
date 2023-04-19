import { ResponseFilm } from "./movies.repository.types";

// Type alias for now. Can change into a separate model later.
export type Movie = ResponseFilm;

export type MovieDTO = Movie & {
  updated: string | null;
  is_favourite: boolean;
  original_title: string;
};
