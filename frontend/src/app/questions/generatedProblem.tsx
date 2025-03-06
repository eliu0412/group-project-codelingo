import { useLocation, useNavigate } from 'react-router-dom';

const GeneratedProblemPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const generatedProblem = location.state?.generatedProblem;

  if (!generatedProblem) {
    return (
      <div className="text-white text-center">
        <p>No problem found. Go back and generate a new one.</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="problems">
      <h2 className="text-white text-3xl font-thick italic text-center mt-10 mb-5">
        Generated Question:
      </h2>
      <div className="problem-details">
        <div className="detail">
          <label className="text-white">Title:</label>
          <input type="text" value={generatedProblem.title} readOnly />
        </div>
        <div className="detail">
          <label className="text-white">Description:</label>
          <textarea value={generatedProblem.problemDescription} readOnly />
        </div>
        <button onClick={() => navigate('/problems')} className="m-5">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default GeneratedProblemPage;
