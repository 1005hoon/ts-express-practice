import * as express from "express";
import authMiddleware from "../middleware/auth.middleware";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import Post from "./post.interface";
import postModel from "./posts.model";
import RequestWithUser from "../interfaces/requestWithUser.interface";

class PostController {
  public path = "/posts";
  public router = express.Router();
  private posts: Post[];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto, true),
        this.modifyPost
      )
      .delete(`${this.path}/:id`, this.deletePost)
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreatePostDto),
        this.createPost
      );
  }

  private getAllPosts = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const posts: Post[] = await postModel.find();
    res.send(posts);
  };

  private getPostById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const post: Post = await postModel.findById(id);
    if (post) {
      res.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private createPost = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const postData: Post = req.body;
    const createdPost = new postModel({
      ...postData,
      authorId: req.user._id,
    });
    await createdPost.save();
    res.send(createdPost);
  };

  private modifyPost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const postData: Post = req.body;
    const updatedPost = await postModel.findByIdAndUpdate(id, postData, {
      new: true,
    });
    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private deletePost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const removedPost = await postModel.findByIdAndDelete(id);
    if (removedPost) {
      res.send(204);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default PostController;
