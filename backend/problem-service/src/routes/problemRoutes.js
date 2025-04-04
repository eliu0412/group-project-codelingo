import express from "express";
import {
  addProblem,
  getProblemsByDifficulty,
  getProblemsByType,
  getProblemsByTags,
  generateProblem,
  getProblemsAll,
  executeCode,
  getAllTags,
  generateChallengeProblem,
  getChallengeProblemsByDate,
  saveUserScore,
  getLeaderboard,
  getUserScore
} from "../controllers/problemController.js";

export const problemRouter = express.Router();

// POST route to add a new problem
problemRouter.post("/add", addProblem);

// GET route to fetch problems by difficulty
problemRouter.get("/difficulty", getProblemsByDifficulty);

// GET route to fetch problems by type
problemRouter.get("/type", getProblemsByType);

// GET route to fetch problems by tags
problemRouter.get("/tags", getProblemsByTags);

// POST route to AI generate a new question
problemRouter.post("/generate", generateProblem);

//GET route to get all problems
problemRouter.get("/all", getProblemsAll);

// POST route execute code
problemRouter.post("/execute", executeCode);

// GET route to get all tags
problemRouter.get("/all-tags", getAllTags);

problemRouter.post("/generate-challenge", generateChallengeProblem);

problemRouter.get("/get-challenge", getChallengeProblemsByDate);

problemRouter.post("/save-user-score", saveUserScore);

problemRouter.get("/get-leaderboard", getLeaderboard);

problemRouter.post("/get-user-score", getUserScore);

export default problemRouter;
