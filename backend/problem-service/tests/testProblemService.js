import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js'; // Import the Express app

const { expect } = chai;
chai.use(chaiHttp);

describe('Problem Service', () => {

  it('should add a problem successfully', (done) => {
    chai.request(server)
      .post('/api/problems/add')
      .send({
        problemType: 'typeA',
        problemDifficulty: 5,
        problemDescription: 'Test description'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.text).to.equal('Problem added successfully.');
        done();
      });
  });

  it('should fail when required fields are missing', (done) => {
    chai.request(server)
      .post('/api/problems/add')
      .send({
        problemId: '1234',
        problemType: 'typeA'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('All fields (problemId, problemType, problemDifficulty, problemDescription) are required.');
        done();
      });
  });

  it('should fail when problem type is invalid', (done) => {
    chai.request(server)
      .post('/api/problems/add')
      .send({
        problemType: 'invalidType',
        problemDifficulty: 5,
        problemDescription: 'Test description'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('Problem type must be one of the following: typeA, typeB, typeC');
        done();
      });
  });

  it('should fail when problem difficulty is less than 1', (done) => {
    chai.request(server)
      .post('/api/problems/add')
      .send({
        problemType: 'typeA',
        problemDifficulty: 0,
        problemDescription: 'Test description'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('Problem difficulty must be between 1 and 10.');
        done();
      });
  });

  it('should fail when problem difficulty is greater than 10', (done) => {
    chai.request(server)
      .post('/api/problems/add')
      .send({
        problemType: 'typeA',
        problemDifficulty: 11,
        problemDescription: 'Test description'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('Problem difficulty must be between 1 and 10.');
        done();
      });
  });

  // Test for fetching problems by difficulty
  it('should get problems by difficulty', (done) => {
    chai.request(server)
      .get('/api/problems/difficulty?difficulty=5')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should return 404 when no problems are found with specified difficulty', (done) => {
    chai.request(server)
      .get('/api/problems/difficulty?difficulty=99') // Assuming 99 is out of the defined range
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.text).to.equal('No problems found with the specified difficulty.');
        done();
      });
  });

  // Test for fetching problems by type
  it('should get problems by type', (done) => {
    chai.request(server)
      .get('/api/problems/type?type=typeA')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should return 404 when no problems are found for the specified type', (done) => {
    chai.request(server)
      .get('/api/problems/type?type=nonExistentType')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.text).to.equal('No problems found for the specified type.');
        done();
      });
  });
});