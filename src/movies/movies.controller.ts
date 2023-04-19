import { Controller, Get, Query } from "@nestjs/common";
import MoviesService from "./movies.service";
import { UserId } from "../lib/user.decorator";

@Controller("movies")
export default class MoviesController {
  constructor(private readonly moviesService: MoviesService) {
  }

  @Get()
  async getMovies(@UserId() userId: string, @Query("search") search: string) {
    return this.moviesService.getAll(userId, `${search}`);
  }
}
