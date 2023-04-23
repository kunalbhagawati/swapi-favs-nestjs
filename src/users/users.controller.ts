import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDTO } from "./users.dto";
import UsersService from "./users.service";

@Controller("users")
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/")
  async addUser(@Body() dto: CreateUserDTO) {
    return { user: await this.usersService.add(dto.id) };
  }
}
