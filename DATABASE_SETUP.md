# Database Setup Instructions

## Option 1: Local MySQL Setup

### 1. Install MySQL
- Download MySQL from: https://dev.mysql.com/downloads/installer/
- Install MySQL Community Server
- During installation, set root password (remember it!)
- Start MySQL service

### 2. Create Database
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE twitter_clone;

-- Create user (optional but recommended)
CREATE USER 'twitter_user'@'localhost' IDENTIFIED BY 'twitter_password';
GRANT ALL PRIVILEGES ON twitter_clone.* TO 'twitter_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE twitter_clone;

-- Run schema (copy-paste from database/schema.sql)
-- Run seed data (copy-paste from database/seed.sql)
```

### 3. Update .env file
```
DB_HOST=localhost
DB_USER=root (or twitter_user)
DB_PASSWORD=your_mysql_password
DB_NAME=twitter_clone
```

## Option 2: XAMPP Setup

### 1. Install XAMPP
- Download XAMPP from: https://www.apachefriends.org/
- Install and start Apache + MySQL

### 2. Create Database via phpMyAdmin
- Open http://localhost/phpmyadmin
- Create new database: `twitter_clone`
- Import schema.sql and seed.sql files

### 3. Update .env file
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD= (usually empty in XAMPP)
DB_NAME=twitter_clone
```

## Option 3: Docker Setup

### 1. Use Docker Compose
```bash
# From project root
docker-compose up mysql
```

This will:
- Start MySQL container
- Create database
- Run schema and seed files automatically

### 2. Update .env file
```
DB_HOST=localhost
DB_USER=twitter_user
DB_PASSWORD=twitter_password
DB_NAME=twitter_clone
```

## Quick Test Backend

After setting up database:

```bash
cd backend
npm start
```

Should see:
```
🚀 Server running on port 5000
📝 Environment: development
✅ Database connected successfully
```

## Frontend + Backend Together

1. Terminal 1: `cd frontend && npm start` (http://localhost:3000)
2. Terminal 2: `cd backend && npm start` (http://localhost:5000)

Test API: http://localhost:5000/api/health