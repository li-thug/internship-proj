import jwt from "jsonwebtoken";
import env from "../utils/validateEnv.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, env.JWT_ACCESS_TOKEN, {
    expiresIn: "2d",
  });
};

export default generateToken;