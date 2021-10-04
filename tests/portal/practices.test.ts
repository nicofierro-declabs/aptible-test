process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { PracticeIn } from '../../src/api/portal/practices/dto';
import knex from '../../src/config/db/knex';
import app from '../../src/index';

var auth = '';

describe("/api/portal/practices", () => {
	before(async () => {
		chai.use(chaiHttp);
		chai.should();
		await knex.migrate.latest();
		await knex.seed.run();
		const res = await chai.request(app).post('/api/portal/users/auth').send({ email: 'admin@decemberlabs.com', password: 'Admin1234*' });
		auth = res.header['set-cookie'][0];
	});
	after(async () => {
		await knex.raw('TRUNCATE TABLE practices RESTART IDENTITY CASCADE')
	})
	describe("POST /", () => {
		const practice: PracticeIn = {
			npi: '1000',
			address: 'Address test',
			practiceType: 'type 1',
			seats: 10
		}
		it("Create new practice without authentication", (done) => {
			chai.request(app).post('/api/portal/practices').send(practice).end((err, res) => {
				res.should.have.status(401);
				res.body.success.should.equal(false);
				done();
			})
		});
		it("Create new practice", (done) => {
			chai.request(app).post('/api/portal/practices').set('Cookie', auth).send(practice).end((err, res) => {
				res.should.have.status(200);
				res.body.success.should.equal(true);
				res.body.data.npi.should.equal('1000');
				done();
			})
		});
	})
	describe("GET /", () => {
		it("Get all practices without authentication", (done) => {
			chai.request(app).get('/api/portal/practices').end((err, res) => {
				res.should.have.status(401);
				res.body.success.should.equal(false);
				done();
			})
		})
		it("Get all practices", (done) => {
			chai.request(app).get('/api/portal/practices').set('Cookie', auth).end((err, res) => {
				res.should.have.status(200);
				res.body.success.should.equal(true);
				res.body.should.have.property('data').with.length(1);
				done();
			})
		})
	});
	describe("GET /seats/:id", () => {
		it("Get seats availables without authentication", (done) => {
			chai.request(app).get('/api/portal/practices/seats/1').end((err, res) => {
				res.should.have.status(401);
				res.body.success.should.equal(false);
				done();
			})
		})
		it("Get seats availables", (done) => {
			chai.request(app).get('/api/portal/practices/seats/1').set('Cookie', auth).end((err, res) => {
				res.should.have.status(200);
				res.body.success.should.equal(true);
				res.body.data.should.have.property('total');
				res.body.data.should.have.property('used');
				done();
			})
		})
	});
});