import express from 'express';
import { addProblem, getProblemsByDifficulty, getProblemsByType } from '../controllers/problemController.js';

const router = express.Router();

// POST route to add a new problem
router.post('/add', addProblem);

// GET route to fetch problems by difficulty
router.get('/difficulty', getProblemsByDifficulty);

// GET route to fetch problems by type
router.get('/type', getProblemsByType);


export default router;