import socketClient from "socket.io-client"; // Ensure you import socket.io-client
import { Server } from "socket.io";
import http from "http";

let server;
let ioServer;
let clientSocket1;
let clientSocket2;

beforeAll((done) => {
  // Create the server and Socket.io instance before all tests
  const app = http.createServer();
  ioServer = new Server(app, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Start the server
  app.listen(8087, () => {
    console.log("Server running on http://localhost:8087");
    done();
  });

  // Handle socket events
  ioServer.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    // Lobby creation
    socket.on("createLobby", (problem, callback) => {
      const lobbyCode = Math.random().toString(36).substr(2, 6);
      socket.join(lobbyCode);
      callback({ success: true, lobbyCode });
    });

    // Join lobby
    socket.on("joinLobby", (lobbyCode, callback) => {
      const room = ioServer.sockets.adapter.rooms.get(lobbyCode);
      if (room && room.size < 4) {
        socket.join(lobbyCode);
        callback({ success: true });
      } else {
        callback({ success: false, message: "Lobby is full" });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
});

beforeEach((done) => {
  // Initialize client sockets before each test
  clientSocket1 = socketClient("http://localhost:8087");
  clientSocket2 = socketClient("http://localhost:8087");

  // Ensure all sockets are connected before running the test
  clientSocket1.on("connect", () => {
    clientSocket2.on("connect", done);
  });
});

afterEach(() => {
  // Clean up after each test by disconnecting the clients
  if (clientSocket1.connected) clientSocket1.disconnect();
  if (clientSocket2.connected) clientSocket2.disconnect();
});

afterAll(() => {
  // Shut down the server after all tests
  ioServer.close();
});

// Test case: Create a lobby
test("should create a lobby", async () => {
  const response = await new Promise((resolve) => {
    clientSocket1.emit("createLobby", "problem1", resolve);
  });

  expect(response.success).toBe(true);
  expect(response.lobbyCode).toHaveLength(6); // Ensure the lobby code is 6 characters
});

// Test case: Join a lobby successfully
test("should join a lobby", async () => {
  // First, create a lobby
  const createResponse = await new Promise((resolve) => {
    clientSocket1.emit("createLobby", "problem1", resolve);
  });

  const lobbyCode = createResponse.lobbyCode;

  // Now, try to join the lobby
  const joinResponse = await new Promise((resolve) => {
    clientSocket2.emit("joinLobby", lobbyCode, resolve);
  });

  expect(joinResponse.success).toBe(true);
});
