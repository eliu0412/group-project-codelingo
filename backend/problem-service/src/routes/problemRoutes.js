import express from 'express';
import { addProblem, getProblemsByDifficulty, getProblemsByType, problemController } from '../controllers/problemController.js';

export const problemRouter = express.Router();

// POST route to add a new problem
problemRouter.post('/add', addProblem);

// GET route to fetch problems by difficulty
problemRouter.get('/difficulty', getProblemsByDifficulty);

// GET route to fetch problems by type
problemRouter.get('/type', getProblemsByType);

// POST route to AI generate a new question
problemRouter.post('/problems', problemController.generateProblem);


export default problemRouter;
