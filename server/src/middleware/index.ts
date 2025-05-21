import helmet from "helmet";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { Express } from "express";

export function applyMiddleware(app: Express) {
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use(cors({ origin: "*" }));
}
