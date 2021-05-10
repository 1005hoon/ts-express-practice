import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import CreateUserDto from "../users/user.dto";
import { User } from "../users/user.entity";
import UserEmailExistingException from "../exceptions/UserEmailExistingException";
import TokenData from "interfaces/tokenData";
import DataStoredInToken from "interfaces/dataStoredInToken";
import LogInDto from "./login.dto";
import WrongCredentialsException from "exceptions/WrongCredentialsException";

class AuthService {
  public userRepository = getRepository(User);

  public async register(userData: CreateUserDto) {
    if (await this.userRepository.findOne({ email: userData.email })) {
      throw new UserEmailExistingException(userData.email);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    user.password = undefined;
    const tokenData = this.generateToken(user);
    const cookie = this.createCookie(tokenData);
    return {
      cookie,
      user,
    };
  }

  public async login(loginData: LogInDto) {
    const user = await this.userRepository.findOne({ email: loginData.email });

    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        loginData.password,
        user.password
      );
      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData = this.generateToken(user);
        const cookies = this.createCookie(tokenData);
        return { user, cookies };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Ages=${tokenData.expiresIn}`;
  }

  public generateToken(user: User) {
    const expiresIn = 60 * 60;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      id: user.id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}

export default AuthService;
