const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

chai.should();
chai.use(chaiHttp);

describe('API', () => {
  it('GET /api/health -> 200', (done) => {
    chai.request(app).get('/api/health').end((err, res) => {
      res.should.have.status(200);
      res.body.should.have.property('status').eql('ok');
      done();
    });
  });

  it('GET /api/os -> 200 + hostname', (done) => {
    chai.request(app).get('/api/os').end((err, res) => {
      res.should.have.status(200);
      res.body.should.have.property('hostname');
      done();
    });
  });

  it('POST /api/echo -> echoes body', (done) => {
    chai.request(app).post('/api/echo').send({ a: 1 }).end((err, res) => {
      res.should.have.status(200);
      res.body.should.have.property('youSent');
      res.body.youSent.should.have.property('a').eql(1);
      done();
    });
  });

  it('GET /api/compute?expr=2*3 -> 6', (done) => {
    chai.request(app).get('/api/compute').query({ expr: '2*3' }).end((err, res) => {
      res.should.have.status(200);
      res.body.should.have.property('result').eql(6);
      done();
    });
  });

  it('GET /api/compute without expr -> 400', (done) => {
    chai.request(app).get('/api/compute').end((err, res) => {
      res.should.have.status(400);
      done();
    });
  });
});
