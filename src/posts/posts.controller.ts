import * as express from "express";
import Post from "./post.interface";
import postModel from "./posts.model";

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
    this.router.post(this.path, this.createPost);
    this.router.patch(`${this.path}/:id`, this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  getAllPosts = async (req: express.Request, res: express.Response) => {
    const posts: Post[] = await postModel.find();
    res.send(posts);
  };

  getPostById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const post: Post = await postModel.findById(id);
    res.send(post);
  };

  createPost = async (req: express.Request, res: express.Response) => {
    const postData: Post = req.body;
    const createdPost = new postModel(postData);
    await createdPost.save();
    res.send(createdPost);
  };

  modifyPost = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const postData: Post = req.body;
    const updatedPost = await postModel.findByIdAndUpdate(id, postData, {
      new: true,
    });
    res.send(updatedPost);
  };

  deletePost = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const removedPost = await postModel.findByIdAndDelete(id);
    if (removedPost) {
      res.send(204);
    } else {
      res.send(404);
    }
  };
}

export default PostController;
