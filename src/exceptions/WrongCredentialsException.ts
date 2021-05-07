import HttpExceptions from "./HttpExceptions";

class WrongCredentialsException extends HttpExceptions {
  constructor() {
    super(401, `Wrong credentials`);
  }
}

export default WrongCredentialsException;
