import * as express from "express";
import * as mongoose from "mongoose";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers) {
    this.app = express();

    this.connectToDatabase();
    this.initializeBodyParser();
    this.initializeControllers(controllers);
  }

  public listen() {
    this.app.listen(process.env.POPT, () => {
      console.log(`App listening on port ${process.env.PORT}`);
    });
  }

  private initializeBodyParser() {
    this.app.use(express.json());
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private connectToDatabase() {
    mongoose.connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => console.log(`DB :: ${mongoose.connection.name}`)
    );
  }
}

export default App;
