import { Server } from "socket.io";
import http from "http";
import socketClient from "socket.io-client";

// Create an in-memory server for testing
let ioServer;
let clientSocket1;
let clientSocket2;
let clientSocket3;
let clientSocket4;

beforeAll((done) => {
  const app = http.createServer();
  ioServer = new Server(app);

  // Set up the server
  ioServer.on("connection", (socket) => {
    socket.on("createLobby", (problem, callback) => {
      const lobbyCode = Math.random().toString(36).substr(2, 6);
      socket.join(lobbyCode);
      callback({ success: true, lobbyCode });
    });

    socket.on("joinLobby", (lobbyCode, callback) => {
      if (socket.rooms.has(lobbyCode)) {
        callback({ success: false, message: "Already in the lobby" });
      } else {
        socket.join(lobbyCode);
        callback({ success: true });
      }
    });

    socket.on("leaveLobby", (lobbyCode, callback) => {
      if (socket.rooms.has(lobbyCode)) {
        socket.leave(lobbyCode);
        callback({ success: true });
      } else {
        callback({ success: false, message: "Not in the lobby" });
      }
    });
  });

  // Start the server
  app.listen(8087, done);
});

beforeEach((done) => {
  // Connect clients before each test
  clientSocket1 = socketClient("http://localhost:8087");
  clientSocket2 = socketClient("http://localhost:8087");
  clientSocket3 = socketClient("http://localhost:8087");
  clientSocket4 = socketClient("http://localhost:8087");

  clientSocket1.on("connect", done);
});

afterEach(() => {
  // Clean up clients after each test
  clientSocket1.disconnect();
  clientSocket2.disconnect();
  clientSocket3.disconnect();
  clientSocket4.disconnect();
});

afterAll(() => {
  ioServer.close();
});

// Test case for creating a lobby
test("should create a lobby", (done) => {
  clientSocket1.emit("createLobby", "problem1", (response) => {
    expect(response.success).toBe(true);
    expect(response.lobbyCode).toHaveLength(6); // Ensure the lobby code is 6 characters
    done();
  });
});

// Test case for joining a lobby
test("should join a lobby", (done) => {
  clientSocket1.emit("createLobby", "problem1", (response) => {
    const lobbyCode = response.lobbyCode;

    clientSocket2.emit("joinLobby", lobbyCode, (joinResponse) => {
      expect(joinResponse.success).toBe(true);
      done();
    });
  });
});

// Test case for joining a full lobby
test("should not join a full lobby", (done) => {
  clientSocket1.emit("createLobby", "problem1", (response) => {
    const lobbyCode = response.lobbyCode;

    clientSocket2.emit("joinLobby", lobbyCode, (joinResponse) => {
      clientSocket3.emit("joinLobby", lobbyCode, (joinResponse2) => {
        clientSocket4.emit("joinLobby", lobbyCode, (joinResponse3) => {
          // All slots taken, lobby is full, fourth client should not be able to join
          expect(joinResponse3.success).toBe(false);
          expect(joinResponse3.message).toBe("Lobby is full");
          done();
        });
      });
    });
  });
});

// Test case for leaving a lobby
test("should leave a lobby", (done) => {
  clientSocket1.emit("createLobby", "problem1", (response) => {
    const lobbyCode = response.lobbyCode;

    clientSocket2.emit("joinLobby", lobbyCode, (joinResponse) => {
      clientSocket2.emit("leaveLobby", lobbyCode, (leaveResponse) => {
        expect(leaveResponse.success).toBe(true);
        done();
      });
    });
  });
});

// Test case for leaving a lobby without being in it
test("should not leave a lobby if not in it", (done) => {
  clientSocket1.emit("createLobby", "problem1", (response) => {
    const lobbyCode = response.lobbyCode;

    clientSocket2.emit("leaveLobby", lobbyCode, (leaveResponse) => {
      expect(leaveResponse.success).toBe(false);
      expect(leaveResponse.message).toBe("Not in the lobby");
      done();
    });
  });
});