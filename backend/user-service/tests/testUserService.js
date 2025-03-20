import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js'; 

const { expect } = chai;
chai.use(chaiHttp);

describe("User Service", () => {

  // Define users and their ranks
  const usersAndRanks = [
    { username: 'user1', rank: 1 },
    { username: 'user2', rank: 2 },
    { username: 'user3', rank: 3 },
    { username: 'user4', rank: 4 },
    { username: 'user5', rank: 5 },
    { username: 'user6', rank: 6 },
    { username: 'user7', rank: 7 },
    { username: 'user8', rank: 8 },
    { username: 'user9', rank: 9 },
    { username: 'user10', rank: 10 },
  ];

  before((done) => {
    // Add ranks for users before tests
    let completedRequests = 0;
    usersAndRanks.forEach((user) => {
      chai
        .request(server)
        .post("/api/user/rank")
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          completedRequests++;
          if (completedRequests === usersAndRanks.length) {
            done(); // Ensure all users are added before starting tests
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
        expect(res.body.length).to.be.at.most(10);
        expect(res.body[0].username).to.equal('user-1'); // Ensure user-1 with highest rank is first
        done();
      });
  });

});