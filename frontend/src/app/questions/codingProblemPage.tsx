interface TestCase {
    input: string;
    output: string;
}

interface Option {
    option: string;
    isCorrect: boolean;
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
    options?: Option[]; // Only for MCQ
    correctAnswer?: string; // Only for Fill in the Blank
    verified: boolean;
    createdAt: Date;
}

interface CodingProblemProps {
  problem: Problem;
}

const CodingProblemPage: React.FC<CodingProblemProps> = ({ problem }) => {
    return (
        <>
        <div className="detail mt-5 bg-gray-800 p-3 rounded-md">
          <p>
            {problem.testCases.map((tc, index) => (
              <span key={index}>
                <strong className="text-white">Example {index + 1}:</strong>
                <br />
                Input: {tc.input}
                <br />
                Output: {tc.output}
                <br />
                <br />
              </span>
            ))}
          </p>
        </div>

        <div className="detail mt-5 bg-gray-800 p-3 rounded-md">
          <p>
            <strong className="text-white">Constraints:</strong>
            <br />
            {problem.constraints?.map((constraint, index) => (
              <span key={index}>
                • {constraint}
                <br />
              </span>
            ))}
          </p>
        </div>

        </>
    );
};
  
export default CodingProblemPage;
  