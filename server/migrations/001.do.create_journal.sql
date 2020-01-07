CREATE TABLE journal (
    id serial PRIMARY KEY, 
    image INTEGER,
    name TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    location TEXT,
    description TEXT,
    type TEXT, 
    rating INTEGER,
    abv INTEGER,
    heaviness INTEGER,
    color INTEGER
);