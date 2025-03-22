import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';
import admin from 'firebase-admin';
import sinon from 'sinon';

const { expect } = chai;
chai.use(chaiHttp);

describe('Auth Controller Integration Tests', () => {
    let testUser = {
        email: "test@example.com",
        username: "testuser",
        password: "Test@1234"
    };

    // Mock Firebase Admin SDK
    beforeEach(() => {
        sinon.stub(admin, "auth").returns({
            getUserByEmail: sinon.stub(),
            createUser: sinon.stub(),
            updateUser: sinon.stub(),
            verifyPasswordResetCode: sinon.stub(),
            confirmPasswordReset: sinon.stub()
        });

        sinon.stub(admin, "database").returns({
            ref: sinon.stub().returns({
                orderByChild: sinon.stub().returns({
                    equalTo: sinon.stub().returns({
                        get: sinon.stub().resolves({ exists: () => false })
                    })
                }),
                set: sinon.stub().resolves()
            })
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    // **Test Case: Register User**
    it('should send email verification for registration', (done) => {
        admin.auth().getUserByEmail.rejects({ code: 'auth/user-not-found' });

        chai.request(server)
            .post('/auth/register')
            .send(testUser)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'Email verification sent');
                done();
            });
    });

    // **Test Case: Register with Existing Email**
    it('should return 400 if email is already taken', (done) => {
        admin.auth().getUserByEmail.resolves({ uid: '12345' });

        chai.request(server)
            .post('/auth/register')
            .send(testUser)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error', 'The email is already taken.');
                done();
            });
    });

    // **Test Case: Login**
    it('should log in user and return a token', (done) => {
        chai.request(server)
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('idToken');
                done();
            });
    });

    // **Test Case: Reset Password**
    it('should reset password successfully', (done) => {
        admin.auth().verifyPasswordResetCode.resolves('valid_oobCode');
        admin.auth().confirmPasswordReset.resolves();

        chai.request(server)
            .post('/auth/resetPassword')
            .send({ oobCode: 'valid_oobCode', newPassword: 'NewPassword@123' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Password has been successfully reset. Please log in with your new password.');
                done();
            });
    });

    // **Test Case: Registration Completion**
    it('should complete registration successfully', (done) => {
        const encryptedData = encodeURIComponent(
            'mockedEncryptedData' // Mocked data for test
        );

        chai.request(server)
            .post('/auth/completeRegistration')
            .send({ encryptedData })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'User successfully registered');
                done();
            });
    });
});
