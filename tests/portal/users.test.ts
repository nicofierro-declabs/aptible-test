process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { EditAccountInfoIn, SignUpModelIn } from '../../src/api/portal/users/dto';
import knex from '../../src/config/db/knex';
import { Invitation } from '../../src/data-access/models/invitation.model';
import app from '../../src/index';

var auth = '';

describe("/api/portal/users", () => {
	before(async () => {
		// runs before all tests in this block
		chai.use(chaiHttp);
		chai.should();
		await knex.migrate.latest();
		await knex.seed.run();
		await knex.raw("INSERT INTO practices values(123, '123', 'test', 'test', 10)");
		const res = await chai.request(app).post('/api/portal/users/auth').send({ email: 'admin@decemberlabs.com', password: 'Admin1234*' });
		auth = res.header['set-cookie'][0];
	});
	after(async () => {
		await knex.raw("TRUNCATE TABLE practices RESTART IDENTITY CASCADE");
		await knex.raw("DELETE FROM portal_users WHERE email <> 'admin@decemberlabs.com'");
	})
	describe("POST /auth", () => {
		it("Check login succesfull", (done) => {
			chai.request(app)
				.post('/api/portal/users/auth')
				.send({ email: 'admin@decemberlabs.com', password: 'Admin1234*' })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.equal(true);
					done();
				})
		});
		it("Check login with wrong password", (done) => {
			chai.request(app)
				.post('/api/portal/users/auth')
				.send({ email: 'admin@decemberlabs.com', password: 'Admin' })
				.end((err, res) => {
					res.should.have.status(401);
					res.body.success.should.equal(false);
					done();
				})
		});
	})
	describe("GET /", () => {
		it("Get all users without authentication", (done) => {
			chai.request(app)
				.get('/api/portal/users')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.success.should.equal(false);
					done();
				})
		})
		it("Get all users", (done) => {
			chai.request(app)
				.get('/api/portal/users')
				.set('Cookie', auth)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.equal(true);
					res.body.should.have.property('data').with.length(1);
					done();
				})
		})
	})
	describe("GET /info", () => {
		it("Get user info by empty token", (done) => {
			chai.request(app)
				.get('/api/portal/users/info')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.success.should.equal(false);
					done();
				})
		})
		it("Get user info by token", (done) => {
			chai.request(app)
				.get('/api/portal/users/info')
				.set('Cookie', auth)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.equal(true);
					res.body.data.should.have.property('email');
					done();
				})
		})
	})
	describe("POST /super-admin", () => {
		const user: SignUpModelIn = {
			email: 'admin@test.com',
			password: 'Admin1234*',
			firstName: 'Administrator',
			lastName: 'Test',
			mobilePhone: '098765432',
			officePhone: '123456789',
			systemRoleId: 1
		}
		it("Create admin user without authentication", (done) => {
			chai.request(app)
				.post('/api/portal/users/super-admin')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.success.should.equal(false);
					done();
				})
		})
		it("Create admin user", (done) => {
			chai.request(app)
				.post('/api/portal/users/super-admin')
				.set('Cookie', auth)
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.equal(true);
					res.body.data.should.have.property('email');
					done();
				})
		})
	})
	describe("PUT /", () => {
		var editUser: EditAccountInfoIn = {
			personalInfo: {
				email: "admin.updated@decemberlabs.com",
				firstName: "Administrator",
				lastName: "Updated",
				mobilePhone: "098765432",
				officePhone: "22345678"
			},
			security: {
				currentPassword: "Admin1234*",
				newPassword: "Admin4321*",
				confirmNewPassword: "Admin4321*"
			},
			notifications: { id: [] }
		}
		it("Create admin user without authentication", (done) => {
			chai.request(app)
				.put('/api/portal/users/2')
				.send(editUser)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.success.should.equal(false);
					done();
				})
		})
		it("Create admin user", (done) => {
			chai.request(app)
				.put('/api/portal/users/2')
				.set('Cookie', auth)
				.send(editUser)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.equal(true);
					done();
				})
		})
	})
	describe("POST /practice-admin", () => {
		const user: SignUpModelIn = {
			email: 'practice@test.com',
			password: 'Admin1234*',
			firstName: 'Practice',
			lastName: 'Test',
			mobilePhone: '098765432',
			officePhone: '123456789',
			systemRoleId: 2,
			practiceId: 123,
		}
		it("Create practice admin without authentication", (done) => {
			chai.request(app)
				.post('/api/portal/users/practice-admin')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.success.should.equal(false);
					done();
				})
		})
		it("Create practice admin", (done) => {
			chai.request(app)
				.post('/api/portal/users/practice-admin')
				.set('Cookie', auth)
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.equal(true);
					res.body.data.should.have.property('email');
					done();
				})
		})
	})
	describe("POST /invite", () => {
		const invite = {
			npi: "123",
			email: "practice@decemberlabs.com",
			prefix: "Dr",
			lastName: "Test",
			firstName: "Doctor",
			speciality: "Test",
			mobilePhone: "098765432",
			officePhone: "12345678",
			systemRoleId: 3,
			permissions: [
				{
					name: "View patients",
					permission: "VIEW_PATIENT",
					description: "View patient basic information",
					permissionId: 1
				}
			],
		}
		it("Add team member without authentication", (done) => {
			chai.request(app)
				.post('/api/portal/users/invite')
				.send(invite)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.success.should.equal(false);
					done();
				})
		})
		it("Add team member", (done) => {
			chai.request(app)
				.post('/api/portal/users/auth')
				.send({ email: 'practice@test.com', password: 'Admin1234*' })
				.end((err, res) => {
					const authAdmin = res.header['set-cookie'][0];
					chai.request(app)
						.post('/api/portal/users/invite')
						.set('Cookie', authAdmin)
						.send(invite)
						.end((err, resInvite) => {
							res.should.have.status(200);
							res.body.success.should.equal(true);
							res.body.data.should.have.property('email');
							done();
						})
				});
		})
	})
	describe("GET /form/:guid", () => {
		var invitation: Invitation;
		before(async () => {
			invitation = (await knex('invitations').where({
				invitation_id: 1,
			}).select('invite_guid').select('number_code'))[0];
		})
		it("Get user form by invite guid and number code wrong", (done) => {
			chai.request(app)
				.get(`/api/portal/users/form/${invitation.inviteGuid}`)
				.set('number-code', `${invitation.numberCode}11`)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.success.should.equal(false);
					done();
				})
		})
		it("Get user form by invite guid and number code", (done) => {
			chai.request(app)
				.get(`/api/portal/users/form/${invitation.inviteGuid}`)
				.set('number-code', `${invitation.numberCode}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.equal(true);
					res.body.data.should.have.property('email');
					done();
				})
		})
	})
	describe("POST /team-member/:guid", () => {
		var invitation: Invitation;
		const user = {
			npi: "123",
			email: "practice@decemberlabs.com",
			prefix: "Dr",
			lastName: "Test",
			firstName: "Doctor",
			speciality: "Test",
			mobilePhone: "098765432",
			officePhone: "12345678",
			systemRoleId: 3,
			password: 'Practice1234*',
			permissions: [
				{
					name: "View patients",
					permission: "VIEW_PATIENT",
					description: "View patient basic information",
					permissionId: 1
				}
			],
		}
		before(async () => {
			invitation = (await knex('invitations').where({
				invitation_id: 1,
			}).select('invite_guid').select('number_code'))[0];
		})
		it("Post user from invite with invalid number code", (done) => {
			chai.request(app)
				.post(`/api/portal/users/team-member/${invitation.inviteGuid}`)
				.set('number-code', `${invitation.numberCode}1`)
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.success.should.equal(false);
					done();
				})
		})
		it("Post user from invite", (done) => {
			chai.request(app)
				.post(`/api/portal/users/team-member/${invitation.inviteGuid}`)
				.set('number-code', `${invitation.numberCode}`)
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.equal(true);
					done();
				})
		})
	})
	describe("GET /team", () => {
		var authAdmin = '';
		before(async () => {
			const res = await chai.request(app)
				.post('/api/portal/users/auth')
				.send({ email: 'practice@test.com', password: 'Admin1234*' });
			authAdmin = res.header['set-cookie'][0];
		})
		it("Get team by token without authentication", (done) => {
			chai.request(app)
				.get('/api/portal/users/team')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.success.should.equal(false);
					done();
				})
		})
		it("Get team by token", (done) => {
			chai.request(app)
				.get('/api/portal/users/team')
				.set('Cookie', authAdmin)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.equal(true);
					res.body.should.have.property('data').with.length(1);
					done();
				})
		})
	})
	describe("GET /patients", () => {
		var authAdmin = '';
		before(async () => {
			const res = await chai.request(app)
				.post('/api/portal/users/auth')
				.send({ email: 'practice@test.com', password: 'Admin1234*' });
			authAdmin = res.header['set-cookie'][0];
		})
		it("Get patients by token without authentication", (done) => {
			chai.request(app)
				.get('/api/portal/users/patients')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.success.should.equal(false);
					done();
				})
		})
		it("Get patients by token", (done) => {
			chai.request(app)
				.get('/api/portal/users/patients')
				.set('Cookie', authAdmin)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.equal(true);
					res.body.should.have.property('data').with.length(0);
					done();
				})
		})
	})
	//TODO: 
	describe("GET /", () => {
		var authAdmin = '';
		before(async () => {
			const res = await chai.request(app)
				.post('/api/portal/users/auth')
				.send({ email: 'practice@test.com', password: 'Admin1234*' });
			authAdmin = res.header['set-cookie'][0];
		})
		it("Get patients by token without authentication", (done) => {
			chai.request(app)
				.get('/api/portal/users/patients')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.success.should.equal(false);
					done();
				})
		})
		it("Get patients by token", (done) => {
			chai.request(app)
				.get('/api/portal/users/patients')
				.set('Cookie', authAdmin)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.equal(true);
					res.body.should.have.property('data').with.length(0);
					done();
				})
		})
	})
});