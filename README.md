# Twitter Clone

A full-stack Twitter clone built with React, Node.js, Express, and MySQL.

## 🚀 Features

### Phase 1 (Current)
- [x] User registration and authentication
- [x] JWT-based login system
- [x] Basic user profiles
- [x] Post creation and viewing
- [x] Responsive design

### Planned Features
- [ ] Comments and likes
- [ ] Follow/unfollow system
- [ ] Real-time notifications
- [ ] Image uploads
- [ ] OAuth (Google/Apple)
- [ ] Advanced search and filtering

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios
- CSS3

**Backend:**
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Bcrypt for password hashing

**DevOps:**
- Docker & Docker Compose
- Environment-based configuration

## 📁 Project Structure

```
twitter-clone/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API calls
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Helper functions
│   │   └── constants/       # App constants
│   └── package.json
├── backend/                  # Node.js API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── config/          # Configuration files
│   │   └── utils/           # Helper functions
│   ├── uploads/             # File uploads
│   ├── logs/               # Application logs
│   └── package.json
├── database/                # SQL scripts
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Test data
├── docker-compose.yml      # Docker configuration
├── .env.example           # Environment template
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd twitter-clone
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up the database**
   ```bash
   # Create database and run schema
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```

4. **Install and run backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

5. **Install and run frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Docker Development

1. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

This will start all services (MySQL, Backend, Frontend) automatically.

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile/:username` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `DELETE /api/posts/:id` - Delete post

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Production Build

1. **Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Backend**
   ```bash
   cd backend
   npm start
   ```

### Environment Variables

Make sure to set production environment variables:
- `NODE_ENV=production`
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` (use a strong secret in production)
- `FRONTEND_URL` (your frontend domain)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- None at the moment

## 📋 Roadmap

See our [project roadmap](ROADMAP.md) for upcoming features and improvements.

## 💬 Support

If you have any questions or need help, please open an issue or contact the maintainers.

---

**Happy coding! 🚀**