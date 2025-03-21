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

const McqProblem: React.FC<CodingProblemProps> = ({ problem }) => {
    return (
        <div className="detail mt-5">
            <div className="options-display mt-3">
            {problem.options && problem.options.length > 0 ? (
                problem.options.map((option, index) => (
                <div key={index} className="option mt-4">
                    <label className="text-white">
                    Option {String.fromCharCode(65 + index)}:
                    </label>
                    <textarea
                    value={option.option}
                    readOnly
                    className="problem-result"
                    style={{
                        width: "100%",
                        height: "100px",
                        marginTop: "5px",
                    }}
                    />
                </div>
                ))
            ) : (
                <p className="text-white">No options available.</p>
            )}
            </div>
        </div>
    );
};
  
  
export default McqProblem;
  