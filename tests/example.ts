process.env.NODE_ENV = 'test';

describe("Example", () => {
	before(() => {
		// runs before all tests in this block
	});
	after(() => {
		// runs after all tests in this block
	});
	beforeEach(() => {
		// runs before each test in this block
	});
	afterEach(() => {
		// runs after each test in this block
	});
	describe("Example", () => {
		it("Example", (done) => {
			done();
		});
	})
});