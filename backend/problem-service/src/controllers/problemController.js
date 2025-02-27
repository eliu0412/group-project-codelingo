import database from '../../../shared/firebaseConfig.js';
import { ref, push } from 'firebase/database';

// Allowable problem types
const allowableTypes = ['typeA', 'typeB', 'typeC'];

export const addProblem = (req, res) => {
  const { problemId, problemType, problemDifficulty, problemDescription } = req.body;

  if (problemId == null || problemType == null || problemDifficulty == null || problemDescription == null) {
    return res.status(400).send('All fields (problemId, problemType, problemDifficulty, problemDescription) are required.');
  }

  if (!allowableTypes.includes(problemType)) {
    return res.status(400).send(`Problem type must be one of the following: ${allowableTypes.join(', ')}`);
  }

  if (problemDifficulty < 1 || problemDifficulty > 10) {
    return res.status(400).send('Problem difficulty must be between 1 and 10.');
  }

  const newProblemRef = ref(database, 'problems');
  push(newProblemRef, {
    problemId,
    problemType,
    problemDifficulty,
    problemDescription
  })
  .then(() => {
    res.status(201).send('Problem added successfully.');
  })
  .catch(error => {
    console.error('Error adding problem:', error);
    res.status(500).send('Internal Server Error');
  });
};