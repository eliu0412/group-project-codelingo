import React, { useState } from 'react';
import axios from 'axios';

const ProblemAI = () => {
  const [generateData, setGenerateData] = useState({
    problemType: '',
    problemDifficulty: '',
    tags: '',
    variationOptions: ''
  });

  const [generatedProblem, setGeneratedProblem] = useState(null);

  const handleChange = (e) => {
    setGenerateData({
      ...generateData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    const { problemType, problemDifficulty, tags, variationOptions } = generateData;

    try {
      const response = await axios.post('http://localhost:4000/api/problems/generate', {
        problemType,
        problemDifficulty: parseInt(problemDifficulty),
        tags: tags.split(',').map(tag => tag.trim()),
        variationOptions: { option1: variationOptions }
      });

      setGeneratedProblem(response.data);
    } catch (error) {
      alert('Error generating problem: ' + error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Generate Problem</h2>
      <form onSubmit={handleGenerate}>
        <input type="text" name="problemType" placeholder="Problem Type" onChange={handleChange} required />
        <input type="number" name="problemDifficulty" placeholder="Difficulty" onChange={handleChange} min="1" max="10" required />
        <input type="text" name="tags" placeholder="Tags (comma separated)" onChange={handleChange} />
        <input type="text" name="variationOptions" placeholder="Variation Options" onChange={handleChange} required />
        <button type="submit">Generate Problem</button>
      </form>
      {generatedProblem && (
        <div>
          <h3>Generated Problem</h3>
          <p>{generatedProblem.problemDescription}</p>
        </div>
      )}
    </div>
  );
};

export default ProblemAI;