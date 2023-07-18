\c todo_database;

DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
    id serial,
    todo varchar(50),
    location varchar(50)
);

INSERT INTO todos (todo, location) VALUES ('Wake Up', 'Home');
INSERT INTO todos (todo, location) VALUES ('Brush Teeth', 'Home');
