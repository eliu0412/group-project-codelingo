import { useLocation, useNavigate } from 'react-router-dom';
import { useProblem } from "./problemContext";
import background from "../../assets/landing.jpg";
import '../styles/general.css';

interface TestCase {
  input: string;
  output: string;
}

interface Problem {
  id: number;
  title: string;
  problemType: string;
  problemDifficulty: number;
  problemDescription: string;
  tags: string[];
  testCases: TestCase[];
  constraints: string[];
  verified: boolean;
  createdAt: Date;
}

const GeneratedProblemPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const generatedProblem: Problem | null = location.state?.generatedProblem;

  const handleBackToListClick = () => {
    navigate('/problems');
  };


  const handleDiscussProblemClick = () => {
    if (generatedProblem) {
      navigate('/discussions/new-discussion', {
        state: {
          previousPage: '/problems/generated',
          problemId: generatedProblem.id,
          problemTitle: generatedProblem.title,
          problemDescription: generatedProblem.problemDescription,
          problemTags: generatedProblem.tags,
        },
      });
    }
  };
  

  if (!generatedProblem) {
    return (
      <div
        className="text-white text-center"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          display: "flex", // Enable flexbox
          flexDirection: "column", // Stack items vertically
          justifyContent: "center", // Center the content vertically
          alignItems: "center", // Center the content horizontally
          paddingBottom: "10vh", // Adjust this to add space at the bottom
        }}
      >
        <p>No problem found. Go back and generate a new one.</p>
        <button onClick={() => navigate('/problems')}>Go Back</button>
      </div>
    );
  }

  return (
    <div
      className="problems"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        display: "flex", // Enable flexbox
        flexDirection: "column", // Stack items vertically
        justifyContent: "center", // Center the content vertically
        alignItems: "center", // Center the content horizontally
        paddingBottom: "10vh", // Adjust this to add space at the bottom
      }}
    >
      <h2 className="text-white text-3xl font-thick italic text-center mt-10 mb-5">
        Generated Question:
      </h2>

      <div className="problem-details">
        <div className="detail mt-5">
          <label className="text-white">Title:</label>
          <input
            style={{
              width: "100%", // Ensure it uses the full width of the parent div
              minWidth: "1000px", // Optional: Set a min width for better control
            }}
            type="text"
            value={generatedProblem.title}
            readOnly
            className="problem-input"
          />
        </div>
        <div className="detail mt-5">
          <label className="text-white">Problem Type:</label>
          <input
            type="text"
            value={generatedProblem.problemType}
            readOnly
            className="problem-input"
          />
        </div>
        <div className="detail mt-5">
          <label className="text-white">Problem Difficulty:</label>
          <input
            type="text"
            value={generatedProblem.problemDifficulty}
            readOnly
            className="problem-input"
          />
        </div>
        <div className="detail mt-5">
          <label className="text-white">Problem Description:</label>
          <textarea
            style={{
              height: "100%",
              minHeight: "600px", // Optional: Set a min width for better control
            }}
            value={generatedProblem.problemDescription}
            readOnly
            className="problem-result"
          />
        </div>
        <div className="detail mt-5">
          <label className="text-white">Tags:</label>
          <div className="tags-display mt-3">
            {generatedProblem.tags.map((tag, index) => (
              <span key={index} className="selected-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="detail mt-5">
          <label className="text-white">Test Cases:</label>
          <textarea
            style={{
              height: "100%",
              minHeight: "200px",
            }}
            value={generatedProblem.testCases
              .map((tc) => `Input: ${tc.input}\nOutput: ${tc.output}`)
              .join('\n\n')}
            readOnly
            className="problem-result"
          />
        </div>
        <div className="detail mt-5">
          <label className="text-white">Constraints:</label>
          <textarea
            style={{
              height: "100%",
              minHeight: "150px", // Optional: Set a min width for better control
            }}
            value={generatedProblem.constraints.join('\n')}
            readOnly
            className="problem-result"
          />
        </div>
      </div>

      <div className="flex justify-center gap-5">
        <button onClick={handleDiscussProblemClick} className="flex-1 p-3 m-10">
          Discuss Problem
        </button>
        <button onClick={handleBackToListClick} className="flex-1 p-3 m-10">
          Go Back
        </button>
        <button className="flex-1 p-3 m-10">
          Solve Problem
        </button>
      </div>
    </div>
  );
};

export default GeneratedProblemPage;
