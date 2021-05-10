import * as express from "express";
import authMiddleware from "../middleware/auth.middleware";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";

import postModel from "./posts.model";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import { getRepository } from "typeorm";
import Post from "./post.entity";

class PostController {
  public path = "/posts";
  public router = express.Router();
  private post = postModel;
  private postRepository = getRepository(Post);

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
    const posts = await this.postRepository.find();
    res.send(posts);
  };

  private getPostById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const post = await this.postRepository.findOne(id);
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
    const postData: CreatePostDto = req.body;
    const createdPost = this.postRepository.create(postData);
    await this.postRepository.save(createdPost);
    res.send(createdPost);
  };

  private modifyPost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { id } = req.params;
    const postData: Post = req.body;
    await this, this.postRepository.update(id, postData);
    const updatedPost = await this.postRepository.findOne(id);
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
    const deleteResponse = await this.postRepository.delete(id);
    if (deleteResponse.raw[1]) {
      res.sendStatus(200);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default PostController;
