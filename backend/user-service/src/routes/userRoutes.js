import express from 'express';
import userController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/discussion', userController.createDiscussion);
userRouter.get('/discussion', userController.getDiscussion);
userRouter.patch('/discussion/:postID', userController.modifyDiscussion);
userRouter.get('/discussion/:id', userController.getDiscussionById); // Fetch a single discussion
userRouter.post('/discussion/:id/comment', userController.addComment); // Add a comment to a discussion

userRouter.post('/rank', userController.addRankToUser);
userRouter.get('/rank', userController.getRankFromUser);

// Add route for top 10 ranked users
userRouter.get('/top-users', userController.getTopRankedUsers);
userRouter.post('/user', userController.addUser); // New endpoint for adding a user

userRouter.post('/gamescore', userController.setGameScore);
userRouter.get('/gamescore', userController.getGameScore);

export default userRouter;
