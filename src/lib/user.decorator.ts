import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import { isNil } from "ramda";
import { validate, version } from "uuid";

// noinspection JSUnusedGlobalSymbols
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    Inject();
    const request = ctx.switchToHttp().getRequest();
    const userId = request.headers["user-id"];

    if (isNil(userId)) {
      throw new HttpException(
        "`user-id` not sent in headers",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (validate(userId) && version(userId) === 4) return userId;

    throw new HttpException(
      "`user-id` is not a valid v4 uuid.",
      HttpStatus.BAD_REQUEST,
    );
  },
);
