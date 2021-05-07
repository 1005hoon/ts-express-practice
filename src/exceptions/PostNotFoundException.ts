import HttpExceptions from "./HttpExceptions";

class PostNotFoundException extends HttpExceptions {
  constructor(id: string) {
    super(404, `Post with id: ${id} is not found!`);
  }
}

export default PostNotFoundException;
