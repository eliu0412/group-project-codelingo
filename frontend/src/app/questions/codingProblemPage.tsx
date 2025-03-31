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
          <div className="space-y-4">
            {problem.testCases?.map((tc, index) => (
              <div key={index}>
                <p className="text-white font-semibold mb-1">Example {index + 1}:</p>
                <div className="space-y-1">
                  <div>
                    <code className="bg-gray-700 text-white px-2 py-1 rounded text-sm">
                      Input:
                    </code>
                    <br />
                    {tc.input && typeof tc.input === "object" && !Array.isArray(tc.input) ? (
                      Object.entries(tc.input).map(([key, value], i) => (
                        <div key={i}>
                          <code className="bg-gray-700 text-white px-2 py-1 rounded text-sm">
                            {key}: {JSON.stringify(value)}
                          </code>
                          <br />
                        </div>
                      ))
                    ) : (
                      <code className="bg-gray-700 text-white px-2 py-1 rounded text-sm">
                        {JSON.stringify(tc.input)}
                      </code>
                    )}
                  </div>
                  <div>
                    <code className="bg-gray-700 text-white px-2 py-1 rounded text-sm">
                      Output: {tc.output}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="detail mt-5 bg-gray-900 p-3 rounded-md">
          <p className="text-white font-semibold mb-2">Constraints:</p>
          <div className="space-y-1">
            {problem.constraints?.map((constraint, index) => (
              <div key={index}>
                <code className="bg-gray-800 text-white px-2 py-1 rounded text-sm">
                  {constraint}
                </code>
              </div>
            ))}
          </div>
        </div>
        </>
    );
};
  
export default CodingProblemPage;
  