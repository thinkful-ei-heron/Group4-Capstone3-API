'use strict';
const express = require('express');
const JournalService = require('./journal-service');
const {requireAuth} = require('../middleware/jwt-auth');

const journalRouter = express.Router();
const jsonBodyParser = express.json();
const path = require('path');


journalRouter.route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        JournalService.getAllJournals(req.app.get('db'), req.user.id)
            .then((journals) => {
                res.json(journals);
            })
            .catch(next);
    })
    .post(jsonBodyParser, (req, res, next) => {
        const requiredFields = ['name'];
        const {name, date_created, location, description, type, rating, abv, heaviness, color} = req.body;
        const newJournal = {name, date_created, location, description, type, rating, abv, heaviness, color};
        for (const field of requiredFields) {
            if (!(field in req.body)) {
                return res.status(400).json({
                    error: {message: `Missing ${field} in request body`}
                });
            }
        }
        Object.assign(newJournal, {user_id: req.user.id});
        JournalService.insertJournal(req.app.get('db'), newJournal)
            .then((journal) => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl + `/${journal.id}`))
                    .json(JournalService.serializeJournal(journal));
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
                        error: {message: 'Journal does not exist'}
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
    .patch(jsonBodyParser, (req, res, next) => {
        const {name, date_created, location, description, type, rating, abv, heaviness, color} = req.body;
        const journalToUpdate = {name, date_created, location, description, type, rating, abv, heaviness, color};

        const numberOfValues = Object.values(journalToUpdate).filter(Boolean).length;
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain name and journal id :) `
                }
            });
        JournalService.updateJournal(req.app.get('db'), req.params.id, journalToUpdate)
            .then((numRowsAffected) => {
                res.status(204).end();
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        JournalService.deleteJournal(req.app.get('db'), parseInt(req.params.id))
        .then(() => {
            res.status(204).json(res.journal)
        })
        .catch(next)
});

module.exports = journalRouter;
