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
        title: 'Test title',
        problemType: 'mcq',
        problemDifficulty: 1,
        problemDescription: 'Test description',
        tags: ['array', 'loop'],
        testCases: {},
        constraints: [],
        options: [
            { "option": "Option A", "isCorrect": false },
            { "option": "Option B", "isCorrect": false },
            { "option": "Option C", "isCorrect": true },
            { "option": "Option D", "isCorrect": false }
          ],
        correctAnswer: {},
        createdAt: new Date(),
        verified: true
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.text).to.equal('Problem added successfully.');
        done();
      });
  });

  it('should add a problem successfully', (done) => {
    chai.request(server)
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
        verified: true
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.text).to.equal('Problem added successfully.');
        done();
      });
  });

  it('should add a problem successfully', (done) => {
    chai.request(server)
      .post('/api/problems/add')
      .send({
        title: 'Test title',
        problemType: 'fill',
        problemDifficulty: 1,
        problemDescription: 'Test description',
        tags: ['array', '`pointers'],
        testCases: {},
        constraints: [],
        options: [],
        correctAnswer: "Correct Answer",
        createdAt: new Date(),
        verified: true
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
        problemType: 'mcq'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('All fields (title, problemType, problemDifficulty, problemDescription) are required.');
        done();
      });
  });

  it('should fail when problem type is invalid', (done) => {
    chai.request(server)
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
        verified: true
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('Problem type must be one of the following: coding, mcq, fill');
        done();
      });
  });

  it('should fail when problem difficulty is less than 1', (done) => {
    chai.request(server)
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
        verified: true
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
        verified: true
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
      .get('/api/problems/type?type=coding')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // Test for fetching problems by type
  it('should get problems by type', (done) => {
    chai.request(server)
      .get('/api/problems/type?type=mcq')
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

  // Test for fetching problems by tags
  it('should get problems by tags', (done) => {
    chai.request(server)
      .get('/api/problems/tags?tags=loop') // Assume 'loop' is a valid tag
      .end((err, res) => {
        console.log('Response body:', res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array'); // Assuming response is an array of problems
        expect(res.body.length).to.be.greaterThan(0); // Ensure there are problems related to 'loop' tag
        done();
      });
  });

  it('should return 404 when no problems are found for the specified tags', (done) => {
    chai.request(server)
      .get('/api/problems/tags?tags=nonExistentTag') // Assuming 'nonExistentTag' doesn't exist
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.text).to.equal('No problems found for the specified tags.');
        done();
      });
  });

  // Test for fetching problems by multiple tags
  it('should get problems by multiple tags', (done) => {
    chai.request(server)
      .get('/api/problems/tags?tags=array,loop') // Assuming 'array' and 'loop' are valid tags
      .end((err, res) => {
        console.log('Response body:', res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array'); // Assuming response is an array of problems
        expect(res.body.length).to.be.greaterThan(0); // Ensure there are problems related to 'array' and 'loop' tags
        done();
      });
  });

  it('should return 404 when no problems are found for the specified multiple tags', (done) => {
    chai.request(server)
      .get('/api/problems/tags?tags=nonExistentTag,anotherNonExistentTag') // Assuming these tags don't exist
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.text).to.equal('No problems found for the specified tags.');
        done();
      });
  });

  // Test for AI generating
  it('should return 400 when missing parameters in the request body', (done) => {
    chai.request(server)
      .post('/api/problems/generate')
      .send({
        problemType: 'coding',
        tags: ['array', 'loop']
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.deep.equal({ error: 'Missing parameters in the request body' });
        done();
      });
  });

  it('should generate a new problem successfully and return 200', function(done) {
    this.timeout(20000); // need time for Gemini to generate

    chai.request(server)
      .post('/api/problems/generate')
      .send({
        problemType: 'mcq',
        problemDifficulty: 5,
        tags: ['array', 'loop'],
        userOptions: { option1: 'about array' }
      })
      .end((err, res) => {
        console.log('Response body:', res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});