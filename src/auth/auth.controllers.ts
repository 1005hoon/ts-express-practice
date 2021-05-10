import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import * as express from "express";
import Controller from "../interfaces/controller.interface";
import CreateUserDto from "../users/user.dto";
import AuthService from "./auth.service";
import LogInDto from "./login.dto";

class AuthController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private authService = new AuthService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post(`${this.path}/register`, this.register);
    this.router.post(`${this.path}/login`, this.login);
  };

  private register = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = req.body;
    try {
      const { cookie, user } = await this.authService.register(userData);
      res.setHeader("Set-Cookie", [cookie]);
      res.send(user);
    } catch (error) {
      next(error);
    }
  };

  private login = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const loginData: LogInDto = req.body;

    const { user, cookies } = await this.authService.login(loginData);
    if (!user || !cookies) {
      next(new WrongCredentialsException());
    } else {
      res.setHeader("Set-Cookie", [cookies]);
      res.send(user);
    }
  };
}

export default AuthController;
