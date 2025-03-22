import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../../src/app/registration/registrationPage";
import { registerUser } from "../../src/app/registration/registrationApi";

// Mock the registration API
jest.mock("../../src/app/registration/registrationApi", () => ({
  registerUser: jest.fn(),
}));

describe("Register", () => {
  it("should display a success message when registration is successful", async () => {
    // Mock the registerUser function to resolve successfully
    registerUser.mockResolvedValue({ message: "Registration successful!" });

    render(<Register /> );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for the success message
    await waitFor(() => screen.getByText("Registration successful!"));

    // Assert that the success message is displayed
    expect(screen.getByText("Registration successful!")).toBeInTheDocument();
  });

  it("should display an error message when registration fails", async () => {
    // Mock the registerUser function to simulate an error
    registerUser.mockResolvedValue({ error: "Something went wrong" });

    render(<Register />);

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for the error message
    await waitFor(() => screen.getByText("Something went wrong"));

    // Assert that the error message is displayed
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
