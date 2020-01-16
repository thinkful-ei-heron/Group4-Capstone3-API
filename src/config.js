/* eslint-disable strict */
module.exports = {
	PORT: process.env.PORT || 8000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin:123@localhost/dearbeer',
	API_KEY: process.env.API_Key || 'AIzaSyCG_FMdGssqTRG7tGSvu24UYFopSWQY_-g',
	JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
	JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};
