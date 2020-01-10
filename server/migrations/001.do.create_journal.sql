CREATE TABLE journal (
    id serial PRIMARY KEY, 
    name TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL ,
    type TEXT NOT NULL, 
    rating FLOAT NOT NULL,
    abv FLOAT NOT NULL,
    heaviness FLOAT NOT NULL,
    color FLOAT NOT NULL
)