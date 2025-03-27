import { jest } from '@jest/globals';

// ✅ Mock the shared Firebase init module
jest.unstable_mockModule('../../shared/initFirebase.js', () => {
  const mockPush = jest.fn().mockResolvedValue();
  const mockGet = jest.fn().mockResolvedValue({
    exists: () => false,
    val: () => null,
  });
  const mockUpdate = jest.fn().mockResolvedValue();
  const mockSet = jest.fn().mockResolvedValue();

  const mockRef = jest.fn(() => ({
    push: mockPush,
    get: mockGet,
    update: mockUpdate,
    set: mockSet,
  }));

  return {
    db: {
      ref: mockRef,
      push: mockPush,
      get: mockGet,
      update: mockUpdate,
      set: mockSet,
    },
  };
});

import request from 'supertest';
import server from '../server.js';
import admin from 'firebase-admin';
import { getDatabase, goOffline } from 'firebase/database';

jest.setTimeout(20000);

describe('Problem Service', () => {
  it('should add a problem successfully (mcq)', async () => {
    const res = await request(server)
      .post('/api/problems/add')
      .send({
        title: 'Test title',
        problemType: 'mcq',
        problemDifficulty: 1,
        problemDescription: 'Test description',
        tags: ['array', 'loop'],
        testCases: {},
        constraints: [],
        options: [
          { option: 'Option A', isCorrect: false },
          { option: 'Option B', isCorrect: false },
          { option: 'Option C', isCorrect: true },
          { option: 'Option D', isCorrect: false },
        ],
        correctAnswer: {},
        createdAt: new Date(),
        verified: true,
      });
    expect(res.status).toBe(201);
    expect(res.text).toBe('Problem added successfully.');
  });

  it('should add a problem successfully (coding)', async () => {
    const res = await request(server)
      .post('/api/problems/add')
      .send({
        title: 'Test title',
        problemType: 'coding',
        problemDifficulty: 1,
        problemDescription: 'Test description',
        tags: ['array', '`pointers'],
        testCases: {},
        constraints: [],
        options: [],
        correctAnswer: {},
        createdAt: new Date(),
        verified: true,
      });
    expect(res.status).toBe(201);
    expect(res.text).toBe('Problem added successfully.');
  });

  it('should fail when required fields are missing', async () => {
    const res = await request(server)
      .post('/api/problems/add')
      .send({
        problemId: '1234',
        problemType: 'mcq',
      });
    expect(res.status).toBe(400);
    expect(res.text).toBe(
      'All fields (title, problemType, problemDifficulty, problemDescription) are required.'
    );
  });

  it('should fail when problem type is invalid', async () => {
    const res = await request(server)
      .post('/api/problems/add')
      .send({
        title: 'Test title',
        problemType: 'invalidType',
        problemDifficulty: 5,
        problemDescription: 'Test description',
        tags: ['array', 'loop'],
        testCases: {},
        constraints: [],
        options: [],
        correctAnswer: {},
        createdAt: new Date(),
        verified: true,
      });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Problem type must be one of the following: coding, mcq, fill');
  });

  it('should fail when problem difficulty is less than 1', async () => {
    const res = await request(server)
      .post('/api/problems/add')
      .send({
        title: 'Test title',
        problemType: 'coding',
        problemDifficulty: 0,
        problemDescription: 'Test description',
        tags: ['array', 'loop'],
        testCases: {},
        constraints: [],
        options: [],
        correctAnswer: {},
        createdAt: new Date(),
        verified: true,
      });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Problem difficulty must be between 1 and 10.');
  });

  it('should fail when problem difficulty is greater than 10', async () => {
    const res = await request(server)
      .post('/api/problems/add')
      .send({
        title: 'Test title',
        problemType: 'coding',
        problemDifficulty: 11,
        problemDescription: 'Test description',
        tags: ['array', 'loop'],
        testCases: {},
        constraints: [],
        options: [],
        correctAnswer: {},
        createdAt: new Date(),
        verified: true,
      });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Problem difficulty must be between 1 and 10.');
  });

  it('should get problems by difficulty', async () => {
    const res = await request(server).get('/api/problems/difficulty?difficulty=5');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it('should return 404 when no problems are found with specified difficulty', async () => {
    const res = await request(server).get('/api/problems/difficulty?difficulty=99');
    expect(res.status).toBe(404);
    expect(res.text).toBe('No problems found with the specified difficulty.');
  });

  it('should get problems by type', async () => {
    const res = await request(server).get('/api/problems/type?type=coding');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it('should return 404 when no problems are found for the specified type', async () => {
    const res = await request(server).get('/api/problems/type?type=nonExistentType');
    expect(res.status).toBe(404);
    expect(res.text).toBe('No problems found for the specified type.');
  });

  it('should get problems by tags', async () => {
    const res = await request(server).get('/api/problems/tags?tags=loop');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return 404 when no problems are found for the specified tags', async () => {
    const res = await request(server).get('/api/problems/tags?tags=nonExistentTag');
    expect(res.status).toBe(404);
    expect(res.text).toBe('No problems found for the specified tags.');
  });

  it('should get problems by multiple tags', async () => {
    const res = await request(server).get('/api/problems/tags?tags=array,loop');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return 404 when no problems are found for the specified multiple tags', async () => {
    const res = await request(server).get('/api/problems/tags?tags=nonExistentTag,anotherNonExistentTag');
    expect(res.status).toBe(404);
    expect(res.text).toBe('No problems found for the specified tags.');
  });

  it('should return 400 when missing parameters in the request body (AI Generation)', async () => {
    const res = await request(server)
      .post('/api/problems/generate')
      .send({
        problemType: 'coding',
        tags: ['array', 'loop'],
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Missing parameters in the request body' });
  });

  it('should generate a new problem successfully and return 200', async () => {
    const res = await request(server)
      .post('/api/problems/generate')
      .send({
        problemType: 'mcq',
        problemDifficulty: 5,
        tags: ['array', 'loop'],
        userOptions: { option1: 'about array' },
      });
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
  });
});

afterAll(async () => {
  try {
    const app = admin.app();
    await app.delete();
  } catch (err) {
    if (!err.message.includes("The default Firebase app does not exist")) {
      throw err;
    }
  }

  try {
    const dbClient = getDatabase();
    goOffline(dbClient);
  } catch (err) {
    if (!err.message.includes("Firebase App")) {
      console.warn("Warning: goOffline failed:", err.message);
    }
  }

  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});
