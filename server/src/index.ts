import "dotenv/config";
import express from "express";
import { applyMiddleware } from "./middleware";

const app = express();
applyMiddleware(app);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is healthy!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
