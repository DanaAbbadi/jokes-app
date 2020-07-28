DROP TABLE IF EXISTS favjokes;

CREATE TABLE jokes(
    id SERIAL PRIMARY KEY,
    typej VARCHAR(255),
    setup VARCHAR(255),
    punchline VARCHAR(255)
);