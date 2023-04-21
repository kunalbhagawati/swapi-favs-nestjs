import { Injectable } from "@nestjs/common";
import { Movie } from "./movies.types";
import SwapiRepository from "../swapi/swapi.repository";

@Injectable()
export default class MoviesRepository {
  constructor(private readonly swapiRepo: SwapiRepository) {}

  getAll = async (): Promise<Movie[]> => this.swapiRepo.getAllFilms();
}
