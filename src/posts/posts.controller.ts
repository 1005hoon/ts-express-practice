import * as express from "express";
import authMiddleware from "../middleware/auth.middleware";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import Post from "./post.interface";
import postModel from "./posts.model";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";

class PostController {
  public path = "/posts";
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.get(
      `${this.path}/:userId/posts`,
      authMiddleware,
      this.getAllPostsByUser
    );
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
    const posts: Post[] = await this.post
      .find()
      .populate("author", "-password");
    res.send(posts);
  };

  private getPostById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const post: Post = await this.post.findById(id);
    if (post) {
      res.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private getAllPostsByUser = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userId = req.params.userId;
    if (userId === req.user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      res.send(posts);
    } else {
      next(new NotAuthorizedException());
    }
  };

  private createPost = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const postData: CreatePostDto = req.body;
    const createdPost = new this.post({
      ...postData,
      authorId: [req.user._id],
    });
    const savedPost = await createdPost.save();
    await savedPost.populate("author", "name").execPopulate();
    res.send(savedPost);
  };

  private modifyPost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const postData: Post = req.body;
    const updatedPost = await this.post.findByIdAndUpdate(id, postData, {
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
    const removedPost = await this.post.findByIdAndDelete(id);
    if (removedPost) {
      res.send(204);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default PostController;
