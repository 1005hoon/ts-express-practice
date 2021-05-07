import { cleanEnv, port, str } from "envalid";

function validateEnvVars() {
  cleanEnv(process.env, {
    PORT: port(),
    MONGO_URI: str(),
  });
}

export default validateEnvVars();
