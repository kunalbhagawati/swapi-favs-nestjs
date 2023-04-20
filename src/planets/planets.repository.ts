import { Injectable } from "@nestjs/common";
import { Planet } from "./planets.types";
import SwapiRepository from "../common/swapi/swapi-repository";

@Injectable()
export default class PlanetsRepository {
  constructor(private readonly swapiRepo: SwapiRepository) {}

  /**
   * Gets all the planets found in swapi.dev.
   *
   * NOTE We'll assume this call will always be fast enough, and small enough.
   *  We do not do any pagination for this yet, because that will be overkill.
   *  We can cache this later if needed.
   */
  getAll = async (): Promise<Planet[]> => this.swapiRepo.getAllPlanets();
}
