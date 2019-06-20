DROP TABLE IF EXISTS chat CASCADE;

CREATE TABLE chat(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL CHECK (message <> ' '),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
