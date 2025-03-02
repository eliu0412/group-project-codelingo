import React from 'react';
import AddProblem from './components/AddProblem';
import ProblemList from './components/ProblemList';
import ProblemAI from './components/ProblemAI';

function App() {
  return (
    <div>
      <h1>Problem Admin Dashboard</h1>
      <AddProblem />
      <ProblemList />
      <ProblemAI />
    </div>
  );
}

export default App;