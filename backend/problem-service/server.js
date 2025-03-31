import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import problemRouter from './src/routes/problemRoutes.js';
import bodyParser from 'body-parser';
import './src/scheduler.js';

const app = express();
const port = 8083;

// has to be this cors or get like error with just app.use(cors(corsConfig));
// const corsConfig = {
//   origin: ['http://localhost:3000', 'http://localhost:5173', 'http://3.149.235.1:5173/'],
//   credentials: true
// };
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/problems', problemRouter);

const server = app.listen(8083, () => {
  console.log(`Problem Service running on http://localhost:8083`);
});

export default server;
