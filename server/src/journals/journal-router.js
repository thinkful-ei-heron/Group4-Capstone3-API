'use strict'
const express = require('express');
const JournalService = require('./journal-service');
const { requireAuth } = require('../middleware/jwt-auth');

const journalRouter = express.Router();
const jsonBodyParser = express.json();

journalRouter.route('/').all(requireAuth).get((req, res, next) => {
	JournalService.getAllJournals(req.app.get('db'), req.user.id)
		.then((journals) => {
			res.json(JournalService.serializeJournal(journals));
		})
		.catch(next);
});

journalRouter
	.route('/:id')
	.all(requireAuth)
	.all((req, res, next) => {
		JournalService.getById(req.app.get('db'), req.params.id)
			.then((journal) => {
				if (!journal) {
					return res.status(404).json({
						error: { message: 'Journal does not exist' }
					});
				}
				res.journal = journal;
				next();
				return null;
			})
			.catch(next);
	})
	.get((req, res, next) => {
		res.json(res.journal);
	})

	.post(jsonBodyParser, (req, res, next) => {
		const requiredFields = [ 'name' ];
		const { name } = req.body;
		console.log(req.body);
		const newJournal = { name };
		for (const field of requiredFields) {
			if (!(field in req.body)) {
				return res.status(400).json({
					error: { message: `Missing ${field} in request body` }
				});
			}
		}
		JournalService.insertJournal(req.app.get('db'), newJournal)
			.then((item) => {
				res
					.status(201)
					.location(path.posix.join(req.originalUrl + `/${journal.id}`))
					.json(JournalService.serializeJournal(journal));
			})
			.catch(next);
	});

journalRouter
	.patch(jsonBodyParser, (req, res, next) => {
		const { name, journal_id } = req.body;
		const journalToUpdate = { name, journal_id };

		const numberOfValues = Object.values(journalToUpdate).filter(Boolean).length;
		if (numberOfValues === 0)
			return res.status(400).json({
				error: {
					message: `Request body must contain name and journal id :) `
				}
			});
		JournalService.updateJournal(req.app.get('db'), req.params.journal_id, journalToUpdate)
			.then((numRowsAffected) => {
				res.status(204).end();
			})
			.catch(next);
	});

module.exports = journalRouter;
