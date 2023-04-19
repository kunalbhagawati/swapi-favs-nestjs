import { Controller, Get, Query } from "@nestjs/common";
import { UserId } from "../lib/user.decorator";
import { prop, sortBy } from "ramda";
import PlanetsService from "./planets.service";

@Controller("planets")
export default class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get()
  async getMovies(@UserId() userId: string, @Query("search") search: string) {
    return sortBy(
      prop("name"),
      await this.planetsService.getAll(userId, search),
    );
  }
}
