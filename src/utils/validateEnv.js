import { cleanEnv } from "envalid";
import { str, port } from "envalid/dist/validators.js";

export default cleanEnv(process.env, {
  MONGODB_URL: str(),
  PORT: port(),
  JWT_ACCESS_TOKEN: str(),
  BASE_URL: str(),
});