// import env vars
import "dotenv/config";

import "reflect-metadata";
import { createConnection } from "typeorm";
import App from "./app";
import config from "./ormconfig";

import PostController from "./posts/posts.controller";

(async () => {
  try {
    await createConnection(config);
    console.log(`Server connected to DB: ${config.database}`);
  } catch (error) {
    console.log(`Error while connecting to DB: ${error}`);
    return error;
  }
  const app = new App([new PostController()]);
  app.listen();
})();
