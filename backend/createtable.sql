/* ONLY RUN IF NEEDED */

/*DROP TABLE IF EXISTS user_genres;
DROP TABLE IF EXISTS user_artists;
DROP TABLE IF EXISTS user_decades;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS users;*/

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS  songs (
    id SERIAL PRIMARY KEY, 
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    year INT, 
    popularity INT DEFAULT 0,
    listeners INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS albums (
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    PRIMARY KEY (title, artist)
);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS song_genres (
    song_id INT REFERENCES songs(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (song_id, genre_id)
);

CREATE TABLE IF NOT EXISTS user_songs (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    song_id INT REFERENCES songs(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, song_id)
);

CREATE TABLE IF NOT EXISTS user_genres (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(id) ON DELETE CASCADE,
    weight INT DEFAULT 1,
    PRIMARY KEY (user_id, genre_id)
);

CREATE TABLE IF NOT EXISTS  user_artists (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    artist TEXT NOT NULL,
    weight INT DEFAULT 1,
    PRIMARY KEY (user_id, artist)
);

CREATE TABLE IF NOT EXISTS user_decades (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    decade INT NOT NULL,
    weight INT DEFAULT 1,
    PRIMARY KEY (user_id, decade)
);

