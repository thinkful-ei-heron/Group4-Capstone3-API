/* eslint-disable indent */
'use strict';
const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//knex instance connection to postgres

function makeKnexInstance() {
	return knex({
		client: 'pg',
		connection: process.env.TEST_DATABASE_URL
	});
}

//create testUsers
function makeUsersArray() {
	return [
		{
			id: 1,
			user_name: 'test-user-1',
			full_name: 'Test user 1',
			password: 'password'
		},
		{
			id: 2,
			user_name: 'test-user-2',
			full_name: 'Test user 2',
			password: 'password'
		}
	];
}

function makeJournals(user) {
	const journals = [
		{
			id: 1,
			name: 'Name 1',
			location: 'Location 1',
			description: 'Desc 1',
			type: 'Ale',
			rating: 5,
			abv: 3,
			heaviness: 3,
			color: 1,
			user_id: user.id
		}
		// {
		// 	id: 2,
		// 	name: 'Name 2',
		// 	location: 'Location 2',
		// 	description: 'Desc 2',
		// 	type: 'Ale',
		// 	rating: 4,
		// 	abv: 5.9,
		// 	heaviness: 4,
		// 	color: 3,
		// 	user_id: user.id
		// },
		// {
		// 	id: 3,
		// 	name: 'Name 3',
		// 	location: 'Location 3',
		// 	description: 'Desc 3',
		// 	type: 'Lager',
		// 	rating: 3,
		// 	abv: 6.7,
		// 	heaviness: 2,
		// 	color: 5,
		// 	user_id: user.id
		// }
	];
	return [ journals ];
}

//make bearer token w. jwt auth header
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
	const token = jwt.sign({ user_id: user.id }, secret, {
		subject: user.user_name,
		algorithm: 'HS256'
	});
	return `Bearer ${token}`;
}

function cleanTables(db) {
	return db.transaction((trx) =>
		trx
			.raw(
				`TRUNCATE
      "users",
      "journal"`
			)
			.then(() =>
				Promise.all([
					trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
					trx.raw(`ALTER SEQUENCE journal_id_seq minvalue 0 START WITH 1`),
					trx.raw(`SELECT setval('users_id_seq', 0)`),
					trx.raw(`SELECT setval('journal_id_seq', 0)`)
				])
			)
	);
}

function seedUsers(db, users) {
	const preppedUsers = users.map((user) => ({
		...user,
		password: bcrypt.hashSync(user.password, 1)
	}));
	return db.transaction(async (trx) => {
		await trx.into('users').insert(preppedUsers);

		await trx.raw(`SELECT setval('users_id_seq', ?)`, [ users[users.length - 1].id ]);
	});
}

async function seedUsersJournals(db, users, journals) {
	await seedUsers(db, users);

	await db.transaction(async (trx) => {
		await trx.into('journal').insert(journals);

		await trx.raw(`SELECT setval('journal_id_seq', ?)`, [ journals[journals.length - 1].id ]);
	});
}

module.exports = {
	makeKnexInstance,
	makeUsersArray,
	makeJournals,
	makeAuthHeader,
	cleanTables,
	seedUsers,
	seedUsersJournals
};
