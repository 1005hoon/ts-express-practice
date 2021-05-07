import * as express from "express";
import Post from "./post.interface";

class PostController {
  public path = "/posts";
  public router = express.Router();

  private posts: Post[] = [
    {
      author: "Hoon",
      title: "build express app with typescript",
      content: "some ipsum shit going on",
    },
  ];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createPost);
  }

  getAllPosts = (req: express.Request, res: express.Response) => {
    res.send(this.posts);
  };

  createPost = (req: express.Request, res: express.Response) => {
    const post: Post = req.body;
    this.posts.push(post);
    res.send(post);
  };
}

export default PostController;
