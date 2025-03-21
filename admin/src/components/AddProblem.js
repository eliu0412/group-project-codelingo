import React, { useState } from 'react';
import axios from 'axios';

const AddProblem = () => {
  const [formData, setFormData] = useState({
    title: '',
    problemType: '',
    problemDifficulty: '',
    problemDescription: '',
    tags: '',
    testCases: [{ input: '', output: '' }],
    constraints: [''],
    options: [{ option: '', isCorrect: false }],
    correctAnswer: '',
    verified: true
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, problemType, problemDifficulty, problemDescription, tags, testCases, constraints, options, correctAnswer, verified } = formData;
    const formattedTags = tags.split(',').map(tag => tag.trim());

    try {
      const response = await axios.post('http://localhost:8083/api/problems/add', {
        title,
        problemType,
        problemDifficulty: parseInt(problemDifficulty),
        problemDescription,
        tags: formattedTags,
        testCases,
        constraints,
        options,
        correctAnswer,
        createdAt: new Date(),
        verified
      });

      alert(response.data);
    } catch (error) {
      if (error.response) {
        alert('Error adding problem: ' + error.response.data);
      } else if (error.request) {
        alert('No response from server');
      } else {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleTestCaseChange = (index, e) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      testCases: updatedTestCases
    });
  };

  const handleAddTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: '', output: '' }]
    });
  };

  const handleRemoveTestCase = (index) => {
    const updatedTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      testCases: updatedTestCases
    });
  };

  const handleOptionChange = (index, e) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      options: updatedOptions,
    });
  };

  const handleAddOption = () => {
    const newOption = { option: '', isCorrect: false };
    setFormData({
      ...formData,
      options: [...formData.options, newOption],
    });
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = formData.options.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      options: updatedOptions
    });
  };

  const handleOptionCorrectChange = (index) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index].isCorrect = !updatedOptions[index].isCorrect;
    setFormData({
      ...formData,
      options: updatedOptions
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Problem</h2>
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <select name="problemType" value={formData.problemType} onChange={handleChange} required>
        <option value="">Select Problem Type</option>
        <option value="coding">Coding</option>
        <option value="mcq">MCQ</option>
        <option value="fill">Fill In The Blank</option>
      </select>
      <input type="number" name="problemDifficulty" placeholder="Difficulty" onChange={handleChange} min="1" max="10" required />
      <textarea name="problemDescription" placeholder="Description" onChange={handleChange} required></textarea>
      <input type="text" name="tags" placeholder="Tags (comma separated)" onChange={handleChange} />

      {/* Conditional fields based on problemType */}
      {formData.problemType === 'coding' && (
        <>
          <h4>Test Cases</h4>
          {formData.testCases.map((testCase, index) => (
            <div key={index}>
              <input type="text" name="input" value={testCase.input} placeholder="Input"
                onChange={(e) => handleTestCaseChange(index, e)}
                required
              />
              <input type="text" name="output" value={testCase.output} placeholder="Output"
                onChange={(e) => handleTestCaseChange(index, e)}
                required
              />
              <button type="button" onClick={() => handleRemoveTestCase(index)}>Remove Test Case</button>
            </div>
          ))}
          <div className="button-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button type="button" onClick={handleAddTestCase}>Add Test Case</button>
          </div>

          <h4>Constraints</h4>
          {formData.constraints.map((constraint, index) => (
            <div key={index}>
              <textarea name="constraint" value={constraint} placeholder="Constraint"
                onChange={(e) => {
                  const updatedConstraints = [...formData.constraints];
                  updatedConstraints[index] = e.target.value;
                  setFormData({ ...formData, constraints: updatedConstraints });
                }}
              />
            </div>
          ))}
          <div className="button-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button type="button" onClick={() => setFormData({ ...formData, constraints: [...formData.constraints, ''] })}>Add Constraint</button>
          </div>
        </>
      )}

      {formData.problemType === 'mcq' && (
        <>
          <h4>Options</h4>
          {formData.options.map((option, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  name="option"
                  value={option.option}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  onChange={(e) => handleOptionChange(index, e)}
                  style={{ width: '550px' }}
                  required
                />
                <button type="button" onClick={() => handleRemoveOption(index)}>Remove</button>
              </div>

              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={() => handleOptionCorrectChange(index)}
                />
                Correct Option
              </label>
            </div>
          ))}
          <div className="button-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button type="button" onClick={handleAddOption}>Add Option</button>
          </div>
        </>
      )}

      {formData.problemType === 'fill' && (
        <>
          <h4>Correct Answer</h4>
          <input type="text" name="correctAnswer" placeholder="Correct Answer" value={formData.correctAnswer} onChange={handleChange} required />
        </>
      )}

      {/* Submit Buttons */}
      <div className="button-container" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px'}}>
        <button type="submit">Add Problem</button>
      </div>
    </form>
  );
};

export default AddProblem;