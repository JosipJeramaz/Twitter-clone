-- Ažuriranje database sheme - dodavanje nedostajućih kolona

-- Dodaj nedostajuće kolone u users tabelu
ALTER TABLE users 
ADD COLUMN location VARCHAR(100) DEFAULT NULL,
ADD COLUMN website VARCHAR(255) DEFAULT NULL,
ADD COLUMN birth_date DATE DEFAULT NULL;

-- Dodaj nedostajuće kolone u posts tabelu
ALTER TABLE posts 
ADD COLUMN likes_count INT DEFAULT 0,
ADD COLUMN comments_count INT DEFAULT 0,
ADD COLUMN retweets_count INT DEFAULT 0,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Proverava da li su kolone uspešno dodane
DESCRIBE users;
DESCRIBE posts;