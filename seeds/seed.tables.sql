BEGIN; 

TRUNCATE 
    users,
    journal
    RESTART IDENTITY CASCADE; 

INSERT INTO users (user_name, full_name, password)
VALUES
    ('admin', 'John Doe', 'pass');


INSERT INTO journal (id, name, location, description, type, rating, abv, heaviness, color, user_id)
VALUES 
    (1, 'double white', '123 abc street brooklyn, NY 11103', 'best beer ever!','lager', 5, 4, 3, 1, 1),
    (2, 'Berry Triple lager', '123 xyz street bethesda, MD 20752', 'Not so great, tasteless!','stout', 3, 5, 3, 1, 1);

COMMIT; 