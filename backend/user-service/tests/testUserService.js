import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

const { expect } = chai;
chai.use(chaiHttp);

describe("User Service", () => {
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
  before((done) => {
    let completedRequests = 0;
    usersAndRanks.forEach((user) => {
      chai
        .request(server)
        .post("/api/user/rank")
        .send(user)
        .end((err, res) => {
          if (err || res.status !== 200) return done(err);
          completedRequests++;
          if (completedRequests === usersAndRanks.length) {
            done();
          }
        });
    });
  });

  it('should retrieve top 10 ranked users', (done) => {
    chai.request(server)
      .get('/api/user/top-users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        
        const expectedUsers = usersAndRanks.map(({ username, rank }) => ({ username, rank }));
        
        expect(res.body.length).to.equal(expectedUsers.length);
        res.body.forEach((user, index) => {
          expect(user.username).to.equal(expectedUsers[index].username);
          expect(user.rank).to.equal(expectedUsers[index].rank);
        });

        done();
      });
  });

  it('should add a new user successfully', (done) => {
    chai.request(server)
      .post('/api/user/rank')
      .send({ username: 'user11', email: 'user11@example.com', rank: 11 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', "Rank '11' updated/added for user 'user11'");
        done();
      });
  });

  it('should retrieve the rank for a specific user', (done) => {
    chai.request(server)
      .get('/api/user/rank?username=user3')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.deep.property('rank', 3);
        done();
      });
  });

  it('should update the rank for an existing user', (done) => {
    chai.request(server)
      .post('/api/user/rank')
      .send({ username: 'user3', email: 'user3@example.com', rank: 5 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', "Rank '5' updated/added for user 'user3'");
        done();
      });
  });

  it('should return an error for a non-existent user when retrieving rank', (done) => {
    chai.request(server)
      .get('/api/user/rank?username=nonExistentUser')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error', 'User not found');
        done();
      });
  });
});

describe('User Service - Game Score', () => {
  const testUsername = 'user1';
  let currentScore, currentWins, currentLosses;

  beforeEach((done) => {
    chai.request(server)
      .get(`/api/user/gamescore?username=${testUsername}`)
      .end((err, res) => {
        if (err || res.status === 404) {
          // Assume initial data if user does not exist
          currentScore = 0;
          currentWins = 0;
          currentLosses = 0;
        } else {
          currentScore = res.body.score || 0;
          currentWins = res.body.wins || 0;
          currentLosses = res.body.losses || 0;
        }
        done();
      });
  });

  it('should add a win successfully', (done) => {
    const newScore = currentScore + 5;
    chai.request(server)
      .post('/api/user/gamescore')
      .send({ username: testUsername, score: newScore, isWin: true })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', `Game score and record updated successfully for user '${testUsername}'`);

        currentWins++;
        done();
      });
  });

  it('should record the win in lastMatchResult', (done) => {
    chai.request(server)
      .get(`/api/user/gamescore?username=${testUsername}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('lastMatchResult', 'win');
        done();
      });
  });

  it('should add a loss successfully', (done) => {
    const newScore = currentScore + 3;
    chai.request(server)
      .post('/api/user/gamescore')
      .send({ username: testUsername, score: newScore, isWin: false })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', `Game score and record updated successfully for user '${testUsername}'`);

        currentLosses++;
        done();
      });
  });

  it('should record the loss in lastMatchResult', (done) => {
    chai.request(server)
      .get(`/api/user/gamescore?username=${testUsername}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('lastMatchResult', 'loss');
        done();
      });
  });

  it('should fail to set game score if user not found', (done) => {
    chai.request(server)
      .post('/api/user/gamescore')
      .send({
        username: 'nonexistentUser',
        score: 50,
        isWin: true
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error', 'User not found');
        done();
      });
  });

  it('should fail to get game score if user not found', (done) => {
    chai.request(server)
      .get('/api/user/gamescore?username=nonexistentUser')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error', 'User not found');
        done();
      });
  });
});