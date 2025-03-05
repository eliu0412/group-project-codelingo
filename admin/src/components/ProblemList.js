import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:8083/api/problems/all'); // endpoint to fetch all problems
        console.log('API response:', response.data); // Log the response data

        // Check if response.data is an object, then extract values
        const data = response.data;
        const parsedProblems = Array.isArray(data) ? data : Object.values(data);

        setProblems(parsedProblems);
        setError(null);
      } catch (error) {
        console.error('Error fetching problems:', error); // Log the error
        setError('Error fetching problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return <div>Loading problems...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Existing Problems</h2>
      {problems.length === 0 ? (
        <div>No problems found.</div>
      ) : (
        problems.map((problem, index) => (
          <div key={problem.id || index}>
            <h3>{problem.title}</h3>
            <p>{problem.problemDescription}</p>
            <small>Type: {problem.problemType} | Difficulty: {problem.problemDifficulty}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default ProblemList;