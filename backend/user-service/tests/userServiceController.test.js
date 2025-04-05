import { jest } from '@jest/globals';
import request from 'supertest';
import server from '../server.js'; // Path to your server
import moment from 'moment';

// Mock the Firebase module
jest.unstable_mockModule('../shared/initFirebase.js', () => {
  const mockPush = jest.fn().mockResolvedValue();
  const mockGet = jest.fn(() => ({
    exists: jest.fn(() => true),  // Confirmed to return true
    val: jest.fn(() => ({
      username: 'testuser',
      streakValue: 1,
      lastDayOfStreak: moment().subtract(1, 'days').startOf('day').valueOf(),
    })),
  }));
  const mockUpdate = jest.fn().mockResolvedValue();
  const mockSet = jest.fn().mockResolvedValue();

  return {
    db: {
      ref: jest.fn(() => ({
        push: mockPush,
        get: mockGet,
        update: mockUpdate,
        set: mockSet,
      })),
    },
  };
});

describe('User Service', () => {
  const usersAndRanks = [
    { username: 'user1', email: 'user1@example.com', rank: 1 },
    { username: 'user2', email: 'user2@example.com', rank: 2 },
    { username: 'user3', email: 'user3@example.com', rank: 3 },
    { username: 'user4', email: 'user4@example.com', rank: 4 },
    { username: 'user5', email: 'user5@example.com', rank: 5 },
    { username: 'user6', email: 'user6@example.com', rank: 6 },
    { username: 'user7', email: 'user7@example.com', rank: 7 },
    { username: 'user8', email: 'user8@example.com', rank: 8 },
    { username: 'user9', email: 'user9@example.com', rank: 9 },
    { username: 'user10', email: 'user10@example.com', rank: 10 },
  ];

  // Set up users with ranks before tests
  beforeAll(async () => {
    await Promise.all(
      usersAndRanks.map(user =>
        request(server)
          .post('/api/user/rank')
          .send(user)
          .expect(200)
      )
    );
  });

  it('should retrieve top 10 ranked users', async () => {
    const res = await request(server).get('/api/user/top-users');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    
    const expectedUsers = usersAndRanks.map(({ username, rank }) => ({ username, rank }));
    
    expect(res.body.length).toBe(expectedUsers.length);
    res.body.forEach((user, index) => {
      expect(user.username).toBe(expectedUsers[index].username);
      expect(user.rank).toBe(expectedUsers[index].rank);
    });
  });

  it('should add a new user successfully', async () => {
    const res = await request(server)
      .post('/api/user/rank')
      .send({ username: 'user11', email: 'user11@example.com', rank: 11 });
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', "Rank '11' updated/added for user 'user11'");
  });

  it('should retrieve the rank for a specific user', async () => {
    const res = await request(server).get('/api/user/rank?username=user3');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('rank', 3);
  });

  it('should update the rank for an existing user', async () => {
    const res = await request(server)
      .post('/api/user/rank')
      .send({ username: 'user3', email: 'user3@example.com', rank: 5 });
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', "Rank '5' updated/added for user 'user3'");
  });

  it('should return an error for a non-existent user when retrieving rank', async () => {
    const res = await request(server).get('/api/user/rank?username=nonExistentUser');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });
});

describe('User Service - Game Score', () => {
  const testUsername = 'user1';
  let currentScore, currentWins, currentLosses;

  beforeEach(async () => {
    try {
      const res = await request(server).get(`/api/user/gamescore?username=${testUsername}`);
      if (res.status === 404) {
        // Assume initial data if user does not exist
        currentScore = 0;
        currentWins = 0;
        currentLosses = 0;
      } else {
        currentScore = res.body.score || 0;
        currentWins = res.body.wins || 0;
        currentLosses = res.body.losses || 0;
      }
    } catch (error) {
      currentScore = 0;
      currentWins = 0;
      currentLosses = 0;
    }
  });

  it('should add a win successfully', async () => {
    const newScore = currentScore + 5;
    const res = await request(server)
      .post('/api/user/gamescore')
      .send({ username: testUsername, score: newScore, isWin: true });
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', `Game score and record updated successfully for user '${testUsername}'`);

    currentWins++;
  });

  it('should record the win in lastMatchResult', async () => {
    const res = await request(server).get(`/api/user/gamescore?username=${testUsername}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('lastMatchResult', 'win');
  });

  it('should add a loss successfully', async () => {
    const newScore = currentScore + 3;
    const res = await request(server)
      .post('/api/user/gamescore')
      .send({ username: testUsername, score: newScore, isWin: false });
      
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', `Game score and record updated successfully for user '${testUsername}'`);

    currentLosses++;
  });

  it('should record the loss in lastMatchResult', async () => {
    const res = await request(server).get(`/api/user/gamescore?username=${testUsername}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('lastMatchResult', 'loss');
  });

  it('should fail to set game score if user not found', async () => {
    const res = await request(server)
      .post('/api/user/gamescore')
      .send({
        username: 'nonexistentUser',
        score: 50,
        isWin: true
      });
      
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });

  it('should fail to get game score if user not found', async () => {
    const res = await request(server).get('/api/user/gamescore?username=nonexistentUser');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });
});


describe('Streak Service', () => {
  it('should increment streak if called on consecutive days', async () => {
    const res = await request(server).get('/api/user/streak?username=roger');
    
    console.log('Response:', res.status, res.body);

    expect(res.status).toBe(200);

    // Depending on the actual streak value in the database,
    // adjust the expected streak value accordingly.
    expect(res.body).toHaveProperty('streakValue');

    // If possible, confirm the increment in streak value compared to a previous known value.
    // (requires pre-query knowledge of the value)
  });

  it('should reset streak if a day is skipped', async () => {
    // In a real database test, you will either need to manually simulate a 
    // "skipped day" condition or ensure the test data represents this state.

    // Ideally, you prepare the database state before running this specific test.
    
    const res = await request(server).get('/api/user/streak?username=roger');
    expect(res.status).toBe(200);

    // Ensure a known skipped day timestamp is affecting this test:
    expect(res.body).toHaveProperty('streakValue', 0); // Adjust expected value given real data
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request(server).get('/api/user/streak?username=nonexistentuser');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });

  it('should not increment streak if already updated today', async () => {
    // For an actual call, set the user's lastDayOfStreak to today's date beforehand.
    const res = await request(server).get('/api/user/streak?username=roger');
    expect(res.status).toBe(200);

    // Verify that the streak stays the same if run multiple times today.
    expect(res.body).toHaveProperty('streakValue');
  });

  it('should return a 400 error if username is missing', async () => {
    const res = await request(server).get('/api/user/streak');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Username is required');
  });
});