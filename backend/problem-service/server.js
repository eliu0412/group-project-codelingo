import dotenv from 'dotenv/config';
import express from 'express';
import cors from 'cors';
import problemRoutes from './src/routes/problemRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Use the routes
app.use('/api/problems', problemRoutes);

app.listen(port, () => {
  console.log(`Problem Service running on http://localhost:${port}`);
});

// Export the express app for testing purposes
export default app;