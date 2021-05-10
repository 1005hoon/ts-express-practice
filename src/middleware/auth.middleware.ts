import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import userModel from "../users/user.model";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import { getRepository } from "typeorm";
import { User } from "../users/user.entity";

async function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const cookies = req.cookies;
  const userRepository = getRepository(User);
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse.id;
      const user = await userRepository.findOne(id);

      if (user) {
        req.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new WrongAuthenticationTokenException());
  }
}

export default authMiddleware;
