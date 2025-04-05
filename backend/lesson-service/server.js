import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import lessonRouter from "./src/routes/lessonRoutes.js";
import bodyParser from "body-parser";

const app = express();
const port = 8085;

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000/', 'http://localhost:5173/', 'http://3.149.235.1:5173/']
}));
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/lessons", lessonRouter);

const server = app.listen(port, () => {
  console.log(`Lesson-Service running on http://localhost:${port}`);
});

export default server;

