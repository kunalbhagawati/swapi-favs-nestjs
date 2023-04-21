import { Injectable } from "@nestjs/common";
import { Planet } from "./planets.types";
import SwapiRepository from "../swapi/swapi.repository";

@Injectable()
export default class PlanetsRepository {
  constructor(private readonly swapiRepo: SwapiRepository) {}

  getAll = async (): Promise<Planet[]> => this.swapiRepo.getAllPlanets();
}
