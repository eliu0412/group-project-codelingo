import { jest } from '@jest/globals';

// Mock the auth service
jest.unstable_mockModule('../src/services/authService.js', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue({ success: true, message: 'Verification email sent!' })
}));

// Mock the Firebase initialization module used by authController.js
jest.unstable_mockModule('../../shared/initFirebase.js', () => {
  const mockGet = jest.fn().mockResolvedValue({ exists: () => false });
  const mockEqualTo = jest.fn((value) => ({ get: mockGet }));
  const mockOrderByChild = jest.fn((child) => ({ equalTo: mockEqualTo }));
  const mockOnce = jest.fn().mockResolvedValue({ exists: () => false });
  const mockSet = jest.fn();

  const mockAuth = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    verifyPasswordResetCode: jest.fn(),
    confirmPasswordReset: jest.fn()
  };
  const mockDatabase = {
    ref: jest.fn((path = '') => ({
      orderByChild: mockOrderByChild,
      once: mockOnce,
      set: mockSet,
      get: mockGet
    }))
  };
  return {
    admin: {
      auth: () => mockAuth,
      database: () => mockDatabase
    },
    db: mockDatabase
  };
});

import request from 'supertest';
import crypto from 'crypto-js';

// Dynamically import app and mocked service
let app, sendVerificationEmail, server;
beforeAll(async () => {
  const serverModule = await import('../server.js');
  const authServiceModule = await import('../src/services/authService.js');
  app = serverModule.default;
  sendVerificationEmail = authServiceModule.sendVerificationEmail;
  server = app.listen(0); // Start server on a random port
});

afterAll((done) => {
  if (server) {
    server.close(done);
  } else {
    done();
  }
});

const testUser = {
  email: 'test23@example.com',
  username: 'test234user',
  password: 'Test@1234'
};

describe('Auth Controller Integration Tests', () => {
  let mockAuth, mockDb, mockOrderByChild, mockEqualTo, mockGet, mockOnce, mockSet;

  beforeEach(async () => {
    const initFirebase = await import('../../shared/initFirebase.js');
    mockAuth = initFirebase.admin.auth();
    mockDb = initFirebase.db;

    // Extract persistent mocks by calling the chain
    mockOrderByChild = mockDb.ref('users').orderByChild;
    mockEqualTo = mockOrderByChild('username').equalTo;
    mockGet = mockDb.ref('users').get;
    mockOnce = mockDb.ref('users').once;
    mockSet = mockDb.ref('users').set;

    // Reset mocks
    mockAuth.getUserByEmail.mockReset();
    mockAuth.createUser.mockReset();
    mockAuth.updateUser.mockReset();
    mockAuth.verifyPasswordResetCode.mockReset();
    mockAuth.confirmPasswordReset.mockReset();
    mockOrderByChild.mockReset();
    mockEqualTo.mockReset();
    mockGet.mockReset();
    mockOnce.mockReset();
    mockSet.mockReset();

    // Set default mock behavior
    mockOrderByChild.mockReturnValue({ equalTo: mockEqualTo });
    mockEqualTo.mockReturnValue({ get: mockGet });
  });

  it('should return 400 if request body is missing parameters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'a@b.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Missing parameters in the request body');
  });

  it('should return 401 if email is already taken', async () => {
    mockAuth.getUserByEmail.mockResolvedValue({ uid: 'existing-id' });
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'The email is already taken.');
  });

  it('should return 402 if username is already taken', async () => {
    mockAuth.getUserByEmail.mockRejectedValue({ code: 'auth/user-not-found' });
    mockGet.mockResolvedValue({ exists: () => true });
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(mockDb.ref).toHaveBeenCalledWith('users');
    expect(mockOrderByChild).toHaveBeenCalledWith('username');
    expect(mockEqualTo).toHaveBeenCalledWith(testUser.username);
    expect(res.statusCode).toBe(402);
    expect(res.body).toHaveProperty('error', 'The username is already taken.');
  });

  it('should send email verification for valid registration', async () => {
    mockAuth.getUserByEmail.mockRejectedValue({ code: 'auth/user-not-found' });
    mockGet.mockResolvedValue({ exists: () => false });
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Email verification sent');
    expect(sendVerificationEmail).toHaveBeenCalledWith(
      testUser.email,
      expect.stringContaining('http://localhost:5173/verify-email?data=')
    );
  });

  it('should complete registration and return 201', async () => {
    const encryptedData = crypto.AES.encrypt(
      JSON.stringify(testUser),
      'SUPERDUPERSECRETKEY'
    ).toString();
    const userRecord = { uid: 'abc123', emailVerified: false };
    mockAuth.getUserByEmail.mockRejectedValue({ code: 'auth/user-not-found' });
    mockAuth.createUser.mockResolvedValue(userRecord);
    mockAuth.updateUser.mockResolvedValue();
    mockOnce.mockResolvedValue({ exists: () => false });
    const res = await request(app)
      .post('/api/auth/complete-registration')
      .send({ encryptedData: encodeURIComponent(encryptedData) });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User successfully registered');
    expect(res.body).toHaveProperty('uid', 'abc123');
  });

  it('should return 400 if encrypted data is missing on complete-registration', async () => {
    const res = await request(app)
      .post('/api/auth/complete-registration')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid request parameters.');
  });

  it('should log in user and return a token', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ idToken: 'mocked_token' })
      })
    );
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('idToken', 'mocked_token');
    expect(res.body).toHaveProperty('message', 'Login successful');
  });

  it('should return 400 if login params are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Missing parameters in the request body');
  });

  it('should reset password successfully', async () => {
    mockAuth.verifyPasswordResetCode.mockResolvedValue(testUser.email);
    mockAuth.confirmPasswordReset.mockResolvedValue();
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ oobCode: 'code123', newPassword: 'newPass@123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Password has been successfully reset. Please log in with your new password.');
  });

  it('should return 400 if reset-password params are missing', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ oobCode: 'code123' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'oobCode and new password are required.');
  });
});