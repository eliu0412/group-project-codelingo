// In userRoutes.js
import express from 'express';
import userController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/discussion', userController.createDiscussion);
userRouter.get('/discussion', userController.getDiscussion);
userRouter.patch('/discussion/:postID', userController.modifyDiscussion);

userRouter.post('/rank', userController.addRankToUser);
userRouter.get('/rank', userController.getRankFromUser);

// Add route for top 10 ranked users
userRouter.get('/top-users', userController.getTopRankedUsers);
userRouter.post('/user', userController.addUser); // New endpoint for adding a user

userRouter.post('/gamescore', userController.setGameScore);
userRouter.get('/gamescore', userController.getGameScore);

userRouter.get('/streak', userController.getAndUpdateStreak);

export default userRouter;