import "dotenv/config";
import "./utils/validateEnv";

import App from "./app";
import PostController from "./posts/posts.controller";

const app = new App([new PostController()]);

app.listen();
