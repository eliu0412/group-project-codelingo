import { jest } from "@jest/globals";
import request from "supertest";

// Mock the Firebase initialization module used by lessonController.js
jest.unstable_mockModule("../shared/firebaseConfig.js", () => {
  console.log("Mocking ../../shared/firebaseConfig.js"); // Debug log
  return {
    default: "mocked-database", // Mock database object
  };
});

// Mock Firebase database functions to work with the mocked database
jest.unstable_mockModule("firebase/database", () => {
  const mockGet = jest.fn();
  const mockPush = jest.fn();
  const mockRef = jest.fn(() => "mock-ref");
  const mockQuery = jest.fn(() => "mock-query");
  const mockOrderByChild = jest.fn(() => "mock-query");
  const mockEqualTo = jest.fn(() => "mock-query");

  return {
    ref: mockRef,
    push: mockPush,
    query: mockQuery,
    orderByChild: mockOrderByChild,
    equalTo: mockEqualTo,
    get: mockGet,
  };
});

// Dynamically import app and mocked Firebase functions
let app,
  server,
  mockGet,
  mockPush,
  mockRef,
  mockQuery,
  mockOrderByChild,
  mockEqualTo;

beforeAll(async () => {
  // Import the server instance (assuming server.js exports it)
  const { default: importedServer } = await import("../server.js"); // Adjust path if needed
  const firebaseModule = await import("firebase/database");

  // Assign the already exported server
  server = importedServer;
  app = server; // Assign app if needed

  // Extract mocked Firebase functions
  mockGet = firebaseModule.get;
  mockPush = firebaseModule.push;
  mockRef = firebaseModule.ref;
  mockQuery = firebaseModule.query;
  mockOrderByChild = firebaseModule.orderByChild;
  mockEqualTo = firebaseModule.equalTo;
});

afterAll((done) => {
  if (server) {
    server.close(done);
  } else {
    done();
  }
});

describe("Lesson Controller Integration Tests", () => {
  beforeEach(() => {
    // Reset mocks
    mockGet.mockReset();
    mockPush.mockReset();
    mockRef.mockReset();
    mockQuery.mockReset();
    mockOrderByChild.mockReset();
    mockEqualTo.mockReset();
  });

  it("should return 400 if topic or description is missing", async () => {
    const res = await request(app)
      .post("/api/lessons/add") // Adjust endpoint based on your routes
      .send({
        problemDifficulty: "easy",
        problemType: "math",
        problemTags: ["algebra"],
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Fields (topic, description) are required."
    );
  });

  it("should return 404 if no problems found for the specified parameters", async () => {
    mockGet.mockResolvedValue({ exists: () => false });
    mockRef.mockReturnValue({ get: mockGet });
    mockQuery.mockReturnValue({ get: mockGet });
    mockOrderByChild.mockReturnValue({ equalTo: mockEqualTo });
    mockEqualTo.mockReturnValue({ get: mockGet });

    const res = await request(app)
      .post("/api/lessons/add")
      .send({
        topic: "Algebra Basics",
        description: "Intro to algebra",
        problemDifficulty: "easy",
        problemType: "math",
        problemTags: ["algebra"],
      });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty(
      "error",
      "No problems found for the specified parameters."
    );
  });

  it("should return 404 if no problems match the type and tags", async () => {
    mockGet.mockResolvedValue({
      exists: () => true,
      forEach: (callback) => {
        callback({
          val: () => ({ problemType: "science", tags: ["biology"] }),
        });
        return true;
      },
    });
    mockRef.mockReturnValue({ get: mockGet });
    mockQuery.mockReturnValue({ get: mockGet });
    mockOrderByChild.mockReturnValue({ equalTo: mockEqualTo });
    mockEqualTo.mockReturnValue({ get: mockGet });

    const res = await request(app)
      .post("/api/lessons/add")
      .send({
        topic: "Algebra Basics",
        description: "Intro to algebra",
        problemDifficulty: "easy",
        problemType: "math",
        problemTags: ["algebra"],
      });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty(
      "error",
      "No problems found matching the criteria."
    );
  });

  it("should add a lesson and return 201 if problems match criteria", async () => {
    mockGet.mockResolvedValue({
      exists: () => true,
      forEach: (callback) => {
        callback({
          val: () => ({
            problemType: "math",
            tags: ["algebra"],
            problemDifficulty: "easy",
          }),
          key: "problem1",
        });
        return true;
      },
    });
    mockPush.mockResolvedValue();
    mockRef.mockImplementation((db, path) => {
      if (path === "problems") return { get: mockGet };
      if (path === "lessons") return { push: mockPush };
      return { get: mockGet, push: mockPush };
    });
    mockQuery.mockReturnValue({ get: mockGet });
    mockOrderByChild.mockReturnValue({ equalTo: mockEqualTo });
    mockEqualTo.mockReturnValue({ get: mockGet });

    const res = await request(app)
      .post("/api/lessons/add")
      .send({
        topic: "Algebra Basics",
        description: "Intro to algebra",
        problemDifficulty: "easy",
        problemType: "math",
        problemTags: ["algebra"],
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Lesson added successfully.");
  });

  it("should return 500 if an error occurs", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockGet.mockRejectedValue(new Error("Database error"));
    const res = await request(app)
      .post("/api/lessons/add")
      .send({
        topic: "Algebra Basics",
        description: "Intro to algebra",
        problemDifficulty: "easy",
        problemType: "math",
        problemTags: ["algebra"],
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Internal Server Error");

    consoleSpy.mockRestore(); // Restore console.error after test
  });
  it("should return 404 if problemTags is empty and no problems match", async () => {
    mockGet.mockResolvedValue({
      exists: () => true,
      forEach: (callback) => {
        callback({
          val: () => ({
            problemType: "math",
            tags: ["algebra"],
            problemDifficulty: "easy",
          }),
        });
      },
    });

    const res = await request(app).post("/api/lessons/add").send({
      topic: "Algebra Basics",
      description: "Intro to algebra",
      problemDifficulty: "easy",
      problemType: "math",
      problemTags: [], // ← empty!
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty(
      "error",
      "No problems found matching the criteria."
    );
  });
  it("should return 404 if none of the tags match even partially", async () => {
    mockGet.mockResolvedValue({
      exists: () => true,
      forEach: (callback) => {
        callback({
          val: () => ({
            problemType: "math",
            tags: ["geometry"], // no match with 'algebra'
            problemDifficulty: "easy",
          }),
        });
      },
    });

    const res = await request(app)
      .post("/api/lessons/add")
      .send({
        topic: "Geometry Fundamentals",
        description: "Shapes and angles",
        problemDifficulty: "easy",
        problemType: "math",
        problemTags: ["algebra"], // ← no match
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty(
      "error",
      "No problems found matching the criteria."
    );
  });
});
