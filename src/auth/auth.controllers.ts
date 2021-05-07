import * as bcrypt from "bcrypt";
import * as express from "express";
import * as bcrypt from "bcrypt";
import UserEmailExistingException from "exceptions/UserEmailExistingException";
import Controller from "interfaces/controller.interface";
import validationMiddleware from "middleware/validation.middleware";
import CreateUserDto from "users/user.dto";
import userModel from "users/user.model";
import LogInDto from "./login.dto";
import WrongCredentialsException from "exceptions/WrongCredentialsException";

class AuthController implements Controller {
  public path = "/auth";
  public router = express.router();
  private user = userModel;

  constructor() {}

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
        res.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  };
}

export default AuthController;
