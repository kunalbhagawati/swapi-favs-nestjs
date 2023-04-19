import { Injectable } from "@nestjs/common";
import { SwapiConfig } from "../config/types";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { Planet } from "./planets.types";
import { serializeFromSWAPI } from "./planet.serialization";

@Injectable()
export default class PlanetsRepository {
  constructor(private readonly config: ConfigService) {
  }

  /**
   * Gets all the movies found in swapi.dev.
   *
   * NOTE We'll assume this call will always be fast enough, and small enough.
   *  We do not do any pagination for this yet, because that will be overkill.
   *  We can cache this later if needed.
   */
  async getAll(): Promise<Planet[]> {
    const config = this.config.getOrThrow<SwapiConfig>("swapi");
    const response = await axios.get(`${config.baseUrl}/films`);
    return response.data.results.map(serializeFromSWAPI);
  }
}
