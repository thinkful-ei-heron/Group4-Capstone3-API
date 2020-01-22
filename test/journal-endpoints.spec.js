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
				title: `GET /api/journals`,
				path: `/api/journals`,
				method: supertest(app).get
			},
			{
				title: `POST /api/journals`,
				path: `/api/journals`,
				method: supertest(app).post
			}
		];

		journalSpecificEndpoint.forEach((endpoint) => {
			describe(endpoint.title, () => {
				beforeEach('insert users and journals ', () => {
					return helpers.seedUsersJournals(db, testUsers, testJournals);
				});

				it(`responds with 404 if user doesn't have any journals`, () => {
					return endpoint
						.method(endpoint.path)
						.set('Authorization', helpers.makeAuthHeader(testUsers[1]))
						.send({})
						.expect(404, {
							error: `You don't have any journals`
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
				.get(`/api/journals`)
				.set('Authorization', helpers.makeAuthHeader(testUser))
				.expect(200)
				.expect({
					id: 1,
					name: 'Name 1',
					date_created: testUser.date,
					location: 'Location 1',
					description: 'Desc 1',
					type: 'Ale',
					rating: 5,
					abv: 3,
					heaviness: 3,
					color: 1,
					user_id: testUser.id
				});
		});
	});
});
