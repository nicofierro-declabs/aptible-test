process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import knex from '../../src/config/db/knex';
import app from '../../src/index';

var auth = '';

describe("/api/portal/permissions", () => {
	before(async () => {
		chai.use(chaiHttp);
		chai.should();
		await knex.migrate.latest();
		await knex.seed.run();
		const res = await chai.request(app).post('/api/portal/users/auth').send({ email: 'admin@decemberlabs.com', password: 'Admin1234*' });
		auth = res.header['set-cookie'][0];
	});
	describe("GET /", () => {
		it("Get all permissions without authentication", (done) => {
			chai.request(app).get('/api/portal/permissions').end((err, res) => {
				res.should.have.status(401);
				res.body.success.should.equal(false);
				done();
			})
		});
		it("Get all permissions", (done) => {
			chai.request(app).get('/api/portal/permissions').set('Cookie', auth).end((err, res) => {
				res.should.have.status(200);
				res.body.success.should.equal(true);
				done();
			})
		});
	})
});