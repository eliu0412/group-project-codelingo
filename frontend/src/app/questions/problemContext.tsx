import React, { createContext, useContext, useState } from "react";


interface TestCase {
    input: string;
    output: string;
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

type ProblemContextType = {
  generatedProblem: Problem | null;
  setGeneratedProblem: (problem: Problem | null) => void;
};

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export const ProblemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [generatedProblem, setGeneratedProblem] = useState<Problem | null>(null);

  return (
    <ProblemContext.Provider value={{ generatedProblem, setGeneratedProblem }}>
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblem = () => {
  const context = useContext(ProblemContext);
  if (!context) {
    throw new Error("useProblem must be used within a ProblemProvider");
  }
  return context;
};
