CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password TEXT NOT NULL,
    date_created TEXT NOT NULL DEAFAULT now(),
    date_modified TIMESTAMP
);

ALTER TABLE journal 
    ADD COLUMN
        user_id INTEGER REFERENCES users(id)
        ON DELETE SET NULL;