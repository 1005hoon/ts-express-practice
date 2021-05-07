// import env vars
import "dotenv/config";
import "./utils/validateEnv";

import App from "./app";

import PostController from "./posts/posts.controller";
import AuthController from "./auth/auth.controllers";

const app = new App([new PostController(), new AuthController()]);

app.listen();
