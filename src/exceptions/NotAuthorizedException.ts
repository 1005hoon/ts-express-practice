import HttpExceptions from "./HttpExceptions";

class NotAuthorizedException extends HttpExceptions {
  constructor() {
    super(403, "Not Authorized");
  }
}

export default NotAuthorizedException;
