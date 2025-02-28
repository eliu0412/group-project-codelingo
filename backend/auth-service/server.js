import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // ✅ Allow up to 1MB request body size

// ✅ Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`🔥 Auth-Service received: ${req.method} ${req.url}`);
    console.log(`➡️ Request Body:`, req.body);
    next();
});

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`🚀 Auth Service running on http://localhost:${port}`);
});
