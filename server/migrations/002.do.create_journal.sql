CREATE TABLE journal (
    id serial PRIMARY KEY, 
    image (id int, img verbinary(max))
    name TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    location TEXT,
    description TEXT,
    rating INTEGER,
    abv INTEGER,
    heaviness INTEGER,
    color INTEGER
    user_id INTEGER REFERENCES user(id)
        ON DELETE CASCADE NOT NULL
);