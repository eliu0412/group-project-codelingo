import React, { useState, useEffect } from "react";
import { generateProblem } from "./problemApi";
import background from "../../assets/landing.jpg";
import "../styles/general.css";
import { useNavigate } from "react-router-dom";

interface TestCase {
  input: string;
  output: string;
}

interface ProblemForm {
  problemType: string;
  problemDifficulty: number;
  tags: string[];
  variationOptions: string[];
}

interface Problem {
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

const ProblemPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProblemForm>({
    problemType: "typeA",
    problemDifficulty: 1,
    tags: [],
    variationOptions: [],
  });
  const [generatedProblem, setGeneratedProblem] = useState<Problem | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Allowable problem types and difficulties
  const allowableTypes = ["typeA", "typeB", "typeC"];
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
      [name]: value,
    }));
  };

  // Variation options change handler
  const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      variationOptions: value.split(",").map((option) => option.trim()),
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
      setGeneratedProblem(data);
      setShowForm(false); // Hide the form after generating the problem
    } catch (err) {
      setError("Failed to generate question");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/coding", { state: { problem: generatedProblem } });
  };

  // "Get Question" button click handler
  const handleGetQuestionClick = () => {
    setShowForm(true);
  };

  // "Go Back" button click handler
  const handleBackToListClick = () => {
    setGeneratedProblem(null);
    setFormData({
      problemType: "typeA",
      problemDifficulty: 1,
      tags: [],
      variationOptions: [],
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
              {allowableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
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

            <label className="text-white font-thin italic">
              Variation Options
            </label>
            <input
              type="text"
              id="variationOptions"
              name="variationOptions"
              value={formData.variationOptions.join(", ")}
              onChange={handleVariationChange}
            />

            <div className="flex flex-col justify-center items-center mt-5">
              <button type="submit" disabled={loading}>
                Generate
              </button>
              <button onClick={handleBackToListClick} className="m-5">
                Go Back
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Loading... */}
      {loading && <p>Generating...</p>}

      {/* Show error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* After generating question */}
      {generatedProblem && (
        <div>
          <h2 className="text-white text-3xl font-thick italic text-center mt-10 mb-5">
            Generated Question:
          </h2>

          <div className="problem-details">
            <div className="detail">
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
            <div className="detail">
              <label className="text-white">Problem Type:</label>
              <input
                type="text"
                value={generatedProblem.problemType}
                readOnly
                className="problem-input"
              />
            </div>
            <div className="detail">
              <label className="text-white">Problem Difficulty:</label>
              <input
                type="text"
                value={generatedProblem.problemDifficulty}
                readOnly
                className="problem-input"
              />
            </div>
            <div className="detail">
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
            <div className="detail">
              <label className="text-white">Tags:</label>
              <div className="tags-display">
                {generatedProblem.tags.map((tag, index) => (
                  <span key={index} className="text-white">
                    [{tag}],{" "}
                  </span>
                ))}
              </div>
            </div>
            <div className="detail">
              <label className="text-white">Test Cases:</label>
              <textarea
                style={{
                  height: "100%",
                  minHeight: "200px",
                }}
                value={generatedProblem.testCases
                  .map((tc) => `Input: ${tc.input}\nOutput: ${tc.output}`)
                  .join("\n\n")}
                readOnly
                className="problem-result"
              />
            </div>
            <div className="detail">
              <label className="text-white">Constraints:</label>
              <textarea
                style={{
                  height: "100%",
                  minHeight: "150px", // Optional: Set a min width for better control
                }}
                value={generatedProblem.constraints.join("\n")}
                readOnly
                className="problem-result"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button onClick={handleBackToListClick} className="m-5">
              Go Back
            </button>
            <button onClick={handleNavigate}>Go Code</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;
