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
        <div className="detail mt-5">
            <label className="text-white">Test Cases:</label>
            <textarea
            value={problem.testCases?.map(tc => `Input: ${tc.input}\nOutput: ${tc.output}`).join("\n\n") || ""}
            readOnly
            className="problem-result"
            />
        </div>
        <div className="detail mt-5">
            <label className="text-white">Constraints:</label>
            <textarea value={problem.constraints?.join("\n") || ""} readOnly className="problem-result" />
        </div>
        </>
    );
};
  
export default CodingProblemPage;
  