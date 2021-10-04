process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { RegisterPatientIn } from '../../src/api/portal/patients/dto';
import knex from '../../src/config/db/knex';
import app from '../../src/index';

var auth = '';

describe("/api/portal/patients", () => {
	before(async () => {
		chai.use(chaiHttp);
		chai.should();
		await knex.migrate.latest();
		await knex.seed.run();
		const res = await chai.request(app).post('/api/portal/users/auth').send({ email: 'admin@decemberlabs.com', password: 'Admin1234*' });
		auth = res.header['set-cookie'][0];
	});
	after(async () => {
		await knex.raw('TRUNCATE TABLE patients RESTART IDENTITY');
	})
	describe("POST /", () => {
		const patient: RegisterPatientIn = {
			firstName: 'Charly',
			lastName: 'Garcia',
			dateOfBirth: new Date(1990, 4, 12),
			sex: 'male',
			height: '170',
			weight: '',
			race: '',
			ethnicity: '',
			streetAddress: 'Address test',
			city: 'Montevideo',
			state: 'MVD',
			zipCode: '11111',
			mobilePhone: '098765432',
			email: 'charly@garcia.com',
		}
		it("Create new patient without authentication", (done) => {
			chai.request(app).post('/api/portal/patients').send(patient).end((err, res) => {
				res.should.have.status(401);
				res.body.success.should.equal(false);
				done();
			})
		});
		it("Create new patient", (done) => {
			chai.request(app).post('/api/portal/patients').set('Cookie', auth).send(patient).end((err, res) => {
				res.should.have.status(200);
				res.body.success.should.equal(true);
				res.body.data.firstName.should.equal('Charly');
				done();
			})
		});
	})
	describe("GET /", () => {
		it("Get all patients without authentication", (done) => {
			chai.request(app).get('/api/portal/patients').end((err, res) => {
				res.should.have.status(401);
				res.body.success.should.equal(false);
				done();
			})
		});
		it("Get all patients", (done) => {
			chai.request(app).get('/api/portal/patients').set('Cookie', auth).end((err, res) => {
				res.should.have.status(200);
				res.body.success.should.equal(true);
				res.body.should.have.property('data').with.length(1);
				done();
			})
		});
	})
});