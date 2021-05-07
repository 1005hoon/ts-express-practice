import * as mongoose from "mongoose";
import Post from "./post.interface";

const postSchema = new mongoose.Schema({
  author: String,
  title: String,
  content: String,
});

const postModel = mongoose.model<Post & mongoose.Document>("Post", postSchema);

export default postModel;
