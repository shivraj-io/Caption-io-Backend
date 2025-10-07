# Caption.io Backend API

Express.js + MongoDB backend for Caption.io - AI-powered social media caption generator.

## Features

- 🔐 User authentication (JWT + bcrypt)
- 📝 Post management with AI-generated captions
- 🖼️ Image upload with ImageKit
- 🤖 AI caption generation using Google Gemini
- 📧 Contact form submissions
- 🚀 Ready for Vercel deployment

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- API Keys (see Environment Variables section)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Server will start at `http://localhost:3000`

---

## 🔑 Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
# MongoDB
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/caption-io

# JWT
JWT_SECRET=your_secure_random_string_min_32_chars

# CORS
FRONTEND_URL=http://localhost:5173

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Server
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

### How to Get API Keys

- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Gemini AI:** https://makersuite.google.com/app/apikey
- **ImageKit:** https://imagekit.io/dashboard

--- ## 📡 API Endpoints

### Health Check
- `GET /` → API status
- `GET /api/debug/routes` → List all routes

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepass123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "username": "johndoe",
    "password": "securepass123"
  }
  ```
  Returns: `{ token, user }`

### Posts (`/api/posts`)
All post routes require authentication (Bearer token or cookie).

- `POST /api/posts/generate-caption` - Generate AI caption
  - Body: `multipart/form-data` with `image` file
  - Returns: `{ caption, imageUrl }`

- `POST /api/posts/create` - Create post
  ```json
  {
    "caption": "Your caption here",
    "imageUrl": "https://..."
  }
  ```

- `GET /api/posts` - Get all user posts

- `GET /api/posts/:id` - Get single post

- `DELETE /api/posts/:id` - Delete post

### Contact (`/api/contact`)
- `POST /api/contact` - Submit contact form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Question",
    "message": "Hello..."
  }
  ```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

See full guide: **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)**

**Quick steps:**
1. Push code to GitHub
2. Import project on Vercel
3. Set environment variables
4. Deploy!

```bash
# Using Vercel CLI
npm install -g vercel
vercel login
vercel --prod
```

Your API will be live at: `https://your-project.vercel.app`

### Deploy Script

```bash
bash deploy.sh
```

---

## 🧪 Testing

### Using cURL

**Health check:**
```bash
curl http://localhost:3000/
```

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password123"}'
```

### Using Postman

Import the collection from `docs/` folder (if available) or manually test endpoints.

---

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app setup
│   ├── controllers/        # Route handlers
│   │   ├── auth.controller.js
│   │   ├── post.controller.js
│   │   └── contact.controller.js
│   ├── db/
│   │   └── db.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/            # Mongoose models
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   └── contact.model.js
│   ├── routes/            # API routes
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   └── contact.routes.js
│   └── service/           # External services
│       ├── ai.service.js      # Gemini AI
│       └── storage.service.js # ImageKit
├── server.js              # Entry point
├── vercel.json           # Vercel config
├── package.json
├── .env.example
└── README.md
```

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 5
- **Database:** MongoDB (Mongoose 8)
- **Auth:** JWT + bcrypt
- **File Upload:** Multer
- **Image Storage:** ImageKit
- **AI:** Google Gemini API
- **Deployment:** Vercel

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check `MONGODB_URL` format
- Ensure MongoDB Atlas allows connections from `0.0.0.0/0`
- Verify database user credentials

### CORS Errors
- Update `FRONTEND_URL` in `.env`
- Check `src/app.js` CORS configuration

### Image Upload Fails
- Verify ImageKit credentials
- Check file size limits (default: 5MB)

### AI Caption Generation Fails
- Verify `GEMINI_API_KEY` is valid
- Check API quota limits
- Falls back to default caption if API fails

---

## 📚 Additional Resources

- **Frontend Deployment:** See `../frontend/NETLIFY_DEPLOY.md`
- **Complete Deployment Guide:** See `../DEPLOYMENT.md`
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📄 License

ISC

---

## 👤 Author

**Shivraj Singh**
- GitHub: [@shivraj-io](https://github.com/shivraj-io)
- Email: shivrajsinghr57@gmail.com

---

## 🎉 Deployment Status

- ✅ Vercel ready
- ✅ MongoDB Atlas compatible
- ✅ Environment variables configured
- ✅ CORS setup for production
- ✅ Error handling implemented
- ✅ Security headers added

**Deploy now:** Push to GitHub → Import to Vercel → Deploy! 🚀
