import * as express from "express";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import HttpExceptions from "../exceptions/HttpExceptions";

function validationMiddleware<T>(
  type: any,
  skipMissingProperties = false
): express.RequestHandler {
  return async (req, res, next) => {
    const errors: ValidationError[] = await validate(
      plainToClass(type, req.body),
      { skipMissingProperties }
    );

    if (errors.length > 0) {
      const messages = errors
        .map((err: ValidationError) => Object.values(err.constraints))
        .join(", ");
      next(new HttpExceptions(400, messages));
    } else {
      next();
    }
  };
}

export default validationMiddleware;
