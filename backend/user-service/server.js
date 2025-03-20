import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import bodyParser from 'body-parser';

const app = express();
const port = 8082;

const corsConfig = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(`Lesson Service running on http://localhost:${port}`);
});

export default app;