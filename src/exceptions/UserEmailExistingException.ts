import HttpExceptions from "./HttpExceptions";

class UserEmailExistingException extends HttpExceptions {
  constructor(email: string) {
    super(400, `User with email ${email} already exists`);
  }
}

export default UserEmailExistingException;
