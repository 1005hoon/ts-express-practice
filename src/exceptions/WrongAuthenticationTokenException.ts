import HttpExceptions from "./HttpExceptions";

class WrongAuthenticationTokenException extends HttpExceptions {
  constructor() {
    super(401, "Wrong authentication token");
  }
}

export default WrongAuthenticationTokenException;
