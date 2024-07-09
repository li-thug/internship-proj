import express, { json } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import cors from "cors"
import authRoutes from "./routes/user.js";


const app = express();
app.use(morgan("dev"));
app.use(cors())
app.use(json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Hello mongoose");
});

//api routes
app.use("/api/auth", authRoutes);


//no routes error
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

//general and specific errors
app.use((error, req, res) => {
  console.log(error);
  let errorMessage = "An unknonwn error has occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
