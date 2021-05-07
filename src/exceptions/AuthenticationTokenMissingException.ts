import HttpExceptions from "./HttpExceptions";

class AuthenticationTokenMissngException extends HttpExceptions {
  constructor() {
    super(401, "Authentication token missing");
  }
}

export default AuthenticationTokenMissngException;
