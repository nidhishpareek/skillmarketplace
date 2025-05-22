import "dotenv/config";
import express from "express";
import { applyMiddleware } from "./middleware";
import routes from "./routes";
import { ENV } from "./config/constants";

const app = express();
applyMiddleware(app);

app.use("/", routes);

app.listen(ENV.PORT, () => {
  console.log(`Server is running at http://localhost:${ENV.PORT}`);
});

app.use((req, res) => {
  res.status(404).json({
    error: "endpoint not found",
    path: req.originalUrl,
  });
});
