/* eslint-disable indent */
'use strict';
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('journal Endpoints', function() {
	let db;

	const testUsers = helpers.makeUsersArray();
	const [ testUser ] = testUsers;
	const [ testJournals ] = helpers.makeJournals(testUser);

	before('make knex instance', () => {
		db = helpers.makeKnexInstance();
		app.set('db', db);
	});

	after('disconnect from db', () => db.destroy());

	before('cleanup', () => helpers.cleanTables(db));

	afterEach('cleanup', () => helpers.cleanTables(db));

	/**
   Endpoints for a journal owned by a user
   **/
	describe(`Endpoints protected by user`, () => {
		const journalSpecificEndpoint = [
			{
				title: `GET /api/journals/1`,
				path: `/api/journals/1`,
				method: supertest(app).get
			}
		];

		journalSpecificEndpoint.forEach((endpoint) => {
			describe(endpoint.title, () => {
				beforeEach('insert users and journals ', () => {
					return helpers.seedUsers(db, testUsers);
				});

				it(`responds with 404 if user doesn't have any journals`, () => {
					return endpoint
						.method(endpoint.path)
						.set('Authorization', helpers.makeAuthHeader(testUsers[1]))
						.expect(404, {
							error: {message: "Journal does not exist"}
						});
				});
			});
		});
	});

	/**
   * @description Get journals for a user
   **/
	describe(`GET /api/journals`, () => {
		const [ usersJournal ] = testJournals.filter((journal) => journal.user_id === testUser.id);
		beforeEach('insert users and journals', () => {
			return helpers.seedUsersJournals(db, testUsers, testJournals);
		});

		it(`responds with 200 and user's journal`, () => {
			return supertest(app)
				.get(`/api/journals/1`)
				.set('Authorization', helpers.makeAuthHeader(testUser))
				.expect(200)
				.expect((res) => {
					expect(res.body).to.have.property('id', usersJournal.id);
					expect(res.body).to.have.property('name', usersJournal.name);
					expect(res.body).to.have.property('user_id', usersJournal.user_id);
					expect(res.body).to.have.property('location', usersJournal.location);
				});
		});
	});
});
