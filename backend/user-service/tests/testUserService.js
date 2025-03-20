import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

const { expect } = chai;
chai.use(chaiHttp);

describe("User Service", () => {
  // Define users and their ranks
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

  // Ensure the database is set up before tests start
  before((done) => {
    let completedRequests = 0;
    usersAndRanks.forEach((user) => {
      chai
        .request(server)
        .post("/api/user/rank")
        .send(user)
        .end((err, res) => {
          if (res.status === 200) {
            completedRequests++;
          }
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
        
        const expectedUsers = [
          { username: 'user1', rank: 1 },
          { username: 'user2', rank: 2 },
          { username: 'user3', rank: 3 },
          { username: 'user4', rank: 4 },
          { username: 'user5', rank: 5 },
          { username: 'user6', rank: 6 },
          { username: 'user7', rank: 7 },
          { username: 'user8', rank: 8 },
          { username: 'user9', rank: 9 },
          { username: 'user10', rank: 10 }
        ];

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
        expect(res.body).to.deep.equal({ username: 'user3', rank: 3 });
        done();
      });
  });


  it('should update the rank for an existing user', (done) => {
    chai.request(server)
      .post('/api/user/rank')
      .send({ username: 'user3', email: 'user3@example.com', rank: 5 }) // Updating rank
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