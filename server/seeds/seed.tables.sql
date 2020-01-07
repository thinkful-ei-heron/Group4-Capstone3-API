BEGIN; 

TRUNCATE 
    users,
    journal
    RESTART IDENTITY CASCADE; 

INSERT INTO users (user_name, full_name, password)
VALUES
    ('admin', 'John Doe', 'pass');


INSERT INTO journal (id, image, name, location, description, rating, abv, heaviness, color, user_id)
VALUES 
    (1, 1, 'double white', '123 abc street brooklyn, NY 11103', 'best beer ever!', 5, 4, 3, 2, 1),
    (2, 1, 'Berry Triple lager', '123 xyz street bethesda, MD 20752', 'Not so great, tasteless!', 3, 5, 3, 4, 1);

COMMIT; 