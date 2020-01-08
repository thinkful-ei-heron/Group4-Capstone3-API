'use strict';
const JournalService = {
	getAllJournals(db, user_id) {
		return db.select('*').where('user_id', user_id).from('journal');
	},
	getById(db, id) {
		return db.from('journal').select('*').where('id', id).first();
	},
	insertJournal(db, newJournal) {
		return db
			.insert(newJournal)
			.into('journal')
			.returning('*')
			.then(([ journal ]) => journal)
			.then((journal) => JournalService.getById(db, journal.id));
	},
	updateJournal(db, id, newJournal) {
		return db('journal').where({ id }).update(newJournal);
	},
	deleteJournal(db, id) {
		return db('journal').where({ id }).delete();
	},
	serializeJournal(journal) {
		return {
			id: journal.id,
			image: journal.image,
			name: journal.name,
			date_created: journal.date_created,
			location: journal.location,
			description: journal.description,
			type: journal.type,
			rating: journal.rating,
			abv: journal.abv,
			heaviness: journal.heaviness,
			color: journal.color
		};
	}
};

module.exports = JournalService;
