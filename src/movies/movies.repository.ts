import { Injectable } from "@nestjs/common";
import { SwapiConfig } from "../config/types";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { Movie } from "./movies.types";
import { serializeFromSWAPI } from "./movie.serialization";

@Injectable()
export default class MoviesRepository {
  constructor(private readonly config: ConfigService) {
  }

  async getAll(): Promise<Movie[]> {
    const config = this.config.getOrThrow<SwapiConfig>("swapi");
    const response = await axios.get(`${config.baseUrl}/films`);
    return response.data.results.map(serializeFromSWAPI);
  }
}
