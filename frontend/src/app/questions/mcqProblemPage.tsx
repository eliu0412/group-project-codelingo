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
                <div className="flex flex-wrap -mx-2">
                {problem.options.map((option, index) => (
                    <div
                    key={index}
                    className="w-full md:w-1/2 px-2 mt-4"
                    >
                    <div className="flex flex-col h-full bg-gray-800 text-white p-3 rounded min-h-[130px]">
                        <p className="font-semibold mb-2">
                        Option {String.fromCharCode(65 + index)}:
                        </p>
                        <div className="flex-1">{option.option}</div>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-white">No options available.</p>
            )}
            </div>
        </div>
    );
};
  
  
export default McqProblem;
  