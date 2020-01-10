/* eslint-disable no-console */
/* eslint-disable strict */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const userRouter = require('./user/user-router');
const authRouter = require('./auth/auth-router');
const journalRouter = require('./journals/journal-router');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/journals', journalRouter);

app.use(function errorHandler(error, req, res, next) {
		const response = (NODE_ENV === 'production')
			? { error: 'Server error' }
			: (console.error(error), { error: error.message, details: error })

		res.status(500).json(response)
	}
);

module.exports = app;
