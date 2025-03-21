import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { generateProblem } from './problemApi';
import background from "../../assets/landing.jpg";
import '../styles/general.css';
import './problem.css'

interface TestCase {
  input: string;
  output: string;
}

interface ProblemForm {
  problemType: string;
  problemDifficulty: number;
  tags: string[];
  userOptions: string;
}

interface Problem {
  id: number;
  title: string;
  problemType: string;
  problemDifficulty: number;
  problemDescription: string;
  tags: string[];
  testCases?: TestCase[]; // Only for coding
  constraints?: string[]; // Only for coding
  options?: string[]; // Only for MCQ
  correctAnswer?: string; // Only for Fill in the Blank
  verified: boolean;
  createdAt: Date;
}

const ProblemPage = () => {
  const navigate = useNavigate();

  const typeOptions = [
    { label: "Coding", value: "coding" },
    { label: "MCQ", value: "mcq" },
    { label: "Fill In The Blank", value: "fill" },
  ];

  const [formData, setFormData] = useState<ProblemForm>({
    problemType: "coding",
    problemDifficulty: 1,
    tags: [],
    userOptions: "",
  });
  const [generatedProblem, setGeneratedProblem] = useState<Problem | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Allowable problem types and difficulties
  const allowableTypes = ["coding", "mcq", "fill"];
  const difficulties = Array.from({ length: 10 }, (_, i) => i + 1);

  // Fetch available tags from the database
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = ["array", "tag1", "tag2", "tag3", "tag4", "tag5"]; // Sample data
        setAvailableTags(fetchedTags);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };

    fetchTags();
  }, []);

  // Form input change handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "userOptions" ? value : value,
    }));
  };

  // Variation options change handler
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Tags change handler
  const handleTagsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevData) => ({
      ...prevData,
      tags: selectedOptions,
    }));
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await generateProblem(formData);
      navigate('/problems/generated', { state: { generatedProblem: data } }); // Navigate to new page with data
    } catch (err) {
      setError("Failed to generate question");
    } finally {
      setLoading(false);
    }
  };

  // "Get Question" button click handler
  const handleGetQuestionClick = () => {
    setShowForm(true);
  };

  // "Go Back" button click handler
  const handleBackToListClick = () => {
    setGeneratedProblem(null);
    setFormData({
      problemType: "Coding",
      problemDifficulty: 1,
      tags: [],
      userOptions: "",
    });
    setShowForm(false); // Hide form on going back
  };

  const [showForm, setShowForm] = useState<boolean>(false);

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
      }}
    >
      <div className="flex flex-col justify-center items-center h-full">
        {!showForm && !generatedProblem && (
          <>
            <h1 className="text-white text-6xl m-5 font-mono font-bold">
              Create New Question
            </h1>
            <p className="fade-in text-white font-thin italic m-5">
              Challenge yourself with an original problem and be the first to
              solve it!
            </p>
            <button onClick={handleGetQuestionClick} className="m-5">
              Get Question
            </button>
          </>
        )}

        {showForm && !generatedProblem && (
          <form onSubmit={handleSubmit}>
            <label className="text-white font-thin italic">Problem Type</label>
            <select
              id="problemType"
              name="problemType"
              value={formData.problemType}
              onChange={handleInputChange}
            >
              {typeOptions.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <label className="text-white font-thin italic">
              Problem Difficulty
            </label>
            <select
              id="problemDifficulty"
              name="problemDifficulty"
              value={formData.problemDifficulty}
              onChange={handleInputChange}
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>

            <label className="text-white font-thin italic">Tags</label>
            <div className="tags">
              <select
                id="tags"
                name="tags"
                multiple
                value={formData.tags}
                onChange={handleTagsChange}
              >
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <div className="selected-tags">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="selected-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

              <label className="text-white font-thin italic">User Options</label>
              <textarea
                id="userOptions"
                name="userOptions"
                value={formData.userOptions}
                onChange={handleOptionChange}
              />

            <div className="flex justify-center gap-5 m-10">
              <button onClick={handleBackToListClick} className="flex-1 p-3 m-10">
                Go Back
              </button>
              <button type="submit" className="flex-1 p-3 m-10" disabled={loading}>Generate</button>
            </div>
          </form>
        )}
      </div>

      {/* Loading... */}
      {loading && <p>Generating...</p>}

        {/* Show error */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ProblemPage;
