import * as express from "express";
import * as mongoose from "mongoose";
import * as cookieParser from "cookie-parser";

// import controllers
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandlingMiddleware();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on port ${process.env.PORT}`);
    });
  }

  private initializeMiddlewares() {
    // body parser
    this.app.use(express.json());
    // cookie parser => req.cookies 로 쿠키 접근 가능
    this.app.use(cookieParser());
  }

  private initializeErrorHandlingMiddleware() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private connectToDatabase() {
    try {
      mongoose.connect(
        process.env.MONGO_URI,
        {
          useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
        },
        () => console.log(`DB : ${mongoose.connection.name}`)
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export default App;
