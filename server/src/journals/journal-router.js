'use strict';
const express = require('express');
const path = require('path');
const JournalService = require('./journal-service');
const { requireAuth } = require('../middleware/jwt-auth');

const journalRouter = express.Router();
const jsonBodyParser = express.json();

// const serializeJournals = {}
journalRouter.route('/').all(requireAuth).get((req, res, next) => {
	JournalService.getAllJournals(req.app.get('db'), req.user.id)
		.then((journals) => {
			res.json(journals);
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
		res.json(res.goal);
	});
