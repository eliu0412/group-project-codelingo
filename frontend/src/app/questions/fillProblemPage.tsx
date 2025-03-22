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


const FillInTheBlankProblem: React.FC<CodingProblemProps> = ({ problem }) => {
    return (
        <div className="detail mt-5">
        <label className="text-white">Correct Answer:</label>
        <input type="text" value={problem.correctAnswer || ""} readOnly className="problem-input" />
        </div>
    );
};

export default FillInTheBlankProblem;
  