import * as express from "express";

// import mongoose for db connection
import * as mongoose from "mongoose";

// import controllers
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToDatabase();
    this.initializeBodyParser();
    this.initializeControllers(controllers);
    this.initializeErrorHandlingMiddleware();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on port ${process.env.PORT}`);
    });
  }

  private initializeBodyParser() {
    this.app.use(express.json());
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
