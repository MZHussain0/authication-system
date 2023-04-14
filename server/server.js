import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import connect from "./database/connection.js";
import dotenv from "dotenv";
import router from "./routes/route.js";

dotenv.config();
connect();
const app = express();
const PORT = 8000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

// HTTP Request //
app.get("/", (req, res) => {
  res.status(201).json("Home get request");
});

// API ROUTES //
app.use("/api", router);

// start server only when we have valid connection //
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
