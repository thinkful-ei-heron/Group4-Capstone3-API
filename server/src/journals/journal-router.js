'use strict';
const express = require('express');
const path = require('path');
const JournalService = require('./journal-service');
const { requireAuth } = require('../middleware/jwt-auth');

const journalRouter = express.Router();
const jsonBodyParser = express.json();
