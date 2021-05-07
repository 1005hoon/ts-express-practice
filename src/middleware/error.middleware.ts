import { Request, Response, NextFunction } from "express";
import HttpExceptions from "exceptions/HttpExceptions";

function errorMiddleware(
  err: HttpExceptions,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const message = err.message || "Server Error";
  res.status(status).send({ status, message });
}

export default errorMiddleware;
