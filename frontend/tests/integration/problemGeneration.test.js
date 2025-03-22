import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GeneratedProblemPage from "../../src/app/questions/generatedProblemPage"; // Adjust path if needed

// Mock necessary dependencies
jest.mock("../../socketContext", () => ({
  useSocket: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  MemoryRouter: jest.requireActual("react-router-dom").MemoryRouter,
}));

describe("GeneratedProblemPage Integration Test", () => {
  let mockNavigate;
  let mockUseSocket;
  let mockUseLocation;

  beforeEach(() => {
    mockNavigate = jest.fn();
    mockUseSocket.mockReturnValue({
      emit: jest.fn((event, data, callback) => {
        callback({ success: true, lobbyCode: "1234" });
      }),
    });
    mockUseLocation.mockReturnValue({
      state: {
        generatedProblem: {
          id: 1,
          title: "Sample Problem",
          problemType: "coding",
          problemDifficulty: 3,
          problemDescription: "This is a sample coding problem.",
          tags: ["JavaScript", "Algorithm"],
          verified: true,
          createdAt: new Date(),
        },
      },
    });
  });

  it("should render generated problem and interact with buttons", async () => {
    render(
      <MemoryRouter initialEntries={["/generated-problem"]}>
        <Routes>
          <Route path="/generated-problem" element={<GeneratedProblemPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify rendering problem details
    expect(screen.getByLabelText(/Title:/i)).toHaveValue("Sample Problem");
    expect(screen.getByLabelText(/Problem Type:/i)).toHaveValue("Coding");
    expect(screen.getByLabelText(/Problem Difficulty:/i)).toHaveValue("3");
    expect(screen.getByLabelText(/Problem Description:/i)).toHaveValue(
      "This is a sample coding problem."
    );

    // Simulate clicking the "Solve Problem" button
    fireEvent.click(screen.getByText(/Solve Problem/i));

    // Verify that navigate is called with correct parameters
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/coding", {
        state: {
          problem: expect.objectContaining({ title: "Sample Problem" }),
        },
      })
    );

    // Simulate clicking the "Solve with Friends" button
    fireEvent.click(screen.getByText(/Solve with Friends/i));

    // Verify that the socket.emit function was called
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/player-lobby/1234", {
        state: { lobbyCode: "1234" },
      })
    );
  });

  it("should render error message if no problem data is found", () => {
    mockUseLocation.mockReturnValueOnce({ state: { generatedProblem: null } });

    render(
      <MemoryRouter>
        <GeneratedProblemPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/No problem found. Go back and generate a new one./i)
    ).toBeInTheDocument();
  });
});
