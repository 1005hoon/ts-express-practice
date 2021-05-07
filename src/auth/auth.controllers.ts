import * as bcrypt from "bcrypt";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import UserEmailExistingException from "../exceptions/UserEmailExistingException";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "../users/user.dto";
import userModel from "../users/user.model";
import LogInDto from "./login.dto";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import User from "../users/user.interface";
import TokenData from "../interfaces/tokenData";
import DataStoredInToken from "../interfaces/dataStoredInToken";

class AuthController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.register
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.login
    );
    this.router.post(`${this.path}/logout`, this.logout);
  }

  private register = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = req.body;
    const userExists = await this.user.findOne({ email: userData.email });

    if (userExists) {
      next(new UserEmailExistingException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      user.password = undefined;
      // 토큰 생성
      const tokenData = this.createToken(user);
      res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
      res.send(user);
    }
  };

  private login = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const loginData: LogInDto = req.body;
    const user = await this.user.findOne({ email: loginData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        loginData.password,
        user.password
      );
      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData = this.createToken(user);
        res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
        res.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  };

  private logout = (req: express.Request, res: express.Response) => {
    res.setHeader("Set-Cookie", ["Authorization=; max-age=0"]);
    res.sendStatus(200);
  };

  private createToken = (user: User): TokenData => {
    const expiresIn = 60 * 60; // 1hr
    const secret = process.env.JWT_SECRET;
    // 사용자 아이디를 jwt 에 심어주기
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    return {
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
      expiresIn,
    };
  };

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthController;
