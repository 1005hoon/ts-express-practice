import HttpExceptions from "./HttpExceptions";

class CategoryNotFoundException extends HttpExceptions {
  constructor(id: string) {
    super(404, `Category with is: ${id} not found`);
  }
}

export default CategoryNotFoundException;
