import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/problems'); // endpoint to fetch all problems
        setProblems(response.data);
      } catch (error) {
        alert('Error fetching problems: ' + error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div>
      <h2>Existing Problems</h2>
      {problems.map((problem) => (
        <div key={problem.id}>
          <h3>{problem.title}</h3>
          <p>{problem.problemDescription}</p>
          <small>Type: {problem.problemType} | Difficulty: {problem.problemDifficulty}</small>
        </div>
      ))}
    </div>
  );
};

export default ProblemList;