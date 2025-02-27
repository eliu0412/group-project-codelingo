import express from 'express';
import { addProblem } from '../controllers/problemController.js';

const router = express.Router();

// POST route to add a new problem
router.post('/add', addProblem);

export default router;