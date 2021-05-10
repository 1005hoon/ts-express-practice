import { getRepository } from "typeorm";
import * as typeorm from "typeorm";
import TokenData from "../../interfaces/tokenData";
import AuthService from "../auth.service";
import CreateUserDto from "../../users/user.dto";
import UserEmailExistingException from "../../exceptions/UserEmailExistingException";

// jest fn을 통해 임의로 repo 모양의 함수를 생성
// typeorm default return value가 Read only이기에, as로 type alias 필요
(typeorm as any).getRepository = jest.fn();

describe("The Auth Service", () => {
  describe("When Registering a user", () => {
    describe("when creating a cookie", () => {
      const tokenData: TokenData = {
        token: "",
        expiresIn: 1,
      };

      it("should return a string", () => {
        (typeorm as any).getRepository.mockReturnValue({});
        const authService = new AuthService();
        expect(typeof authService.createCookie(tokenData)).toEqual("string");
      });
    });

    describe("if the email is already taken", () => {
      it("should throw an error", async () => {
        const userData: CreateUserDto = {
          name: "Tester Hoon",
          email: "tester@hoon.com",
          password: "testerPassword123",
          address: {
            street: "street",
            city: "souel",
            country: "country",
          },
        };

        (typeorm as any).getRepository.mockReturnValue({
          findOne: () => Promise.resolve(userData),
        });

        const authService = new AuthService();

        await expect(authService.register(userData)).rejects.toMatchObject(
          new UserEmailExistingException(userData.email)
        );
      });

      describe("if the email is not taken", () => {
        it("should not throw an error", async () => {
          const userData: CreateUserDto = {
            name: "Tester Hoon",
            email: "tester@hoon.com",
            password: "testerPassword123",
            address: {
              street: "street",
              city: "souel",
              country: "country",
            },
          };
          process.env.JWT_SECRET = "test_secret";
          (typeorm as any).getRepository.mockReturnValue({
            findOne: () => Promise.resolve(undefined),
            create: () => ({
              ...userData,
              id: 0,
            }),
            save: () => Promise.resolve(),
          });
          const authService = new AuthService();
          await expect(authService.register(userData)).resolves.toBeDefined();
        });
      });
    });
  });
});
