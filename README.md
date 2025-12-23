# FaithBliss

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

FaithBliss is Africa's premier faith-based dating platform, specifically designed for Christian singles across all 54 African countries. Built with shared faith, values, and marriage intentions at its core, FaithBliss connects believers seeking meaningful, God-centered relationships that lead to Christian marriage.

## 🌟 Features

### Core Dating Features
- **Smart Matching**: Advanced filtering by country, denomination, church family, and relationship goals
- **Real-time Messaging**: Instant messaging with WebSocket integration
- **Profile Management**: Comprehensive profiles with faith sections, passions, and photos
- **Onboarding Flow**: Guided setup process for new users
- **Dashboard**: Tinder-style interface for browsing and interacting with profiles

### Faith-Focused Features
- **Interdenominational**: Supports 20+ Christian denominations across Africa
- **Marriage Intent**: Platform designed specifically for serious relationships, not casual dating
- **Community Groups**: Sub-groups and interest spaces for believers
- **Faith Resources**: Devotionals, relationship insights, and marriage preparation tools

### Safety & Security
- **Content Moderation**: Filters inappropriate content to maintain Christian values
- **Firebase Authentication**: Secure authentication with Google OAuth support
- **Protected Routes**: JWT-based authorization for API endpoints
- **Image Upload**: Cloudinary integration for secure photo storage

## 🏗️ Architecture

### Frontend (faith-bliss-client)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components
- **State Management**: Zustand
- **Routing**: React Router DOM v7
- **Real-time**: Socket.io client
- **UI Components**: Lucide React icons, Framer Motion animations

### Backend (faith-bliss-server)
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Admin SDK + JWT
- **File Storage**: Cloudinary
- **Real-time**: Socket.io
- **Security**: bcryptjs for password hashing, CORS enabled

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm package manager
- MongoDB database
- Firebase project with authentication enabled
- Cloudinary account for image storage

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/faith-bliss.git
   cd faith-bliss
   ```

2. **Install dependencies for both client and server**
   ```bash
   # Install client dependencies
   cd faith-bliss-client
   pnpm install

   # Install server dependencies
   cd ../faith-bliss-server
   pnpm install
   ```

3. **Environment Setup**

   Create `.env` files in both directories:

   **faith-bliss-server/.env**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/faithbliss
   JWT_SECRET=your-jwt-secret
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   CLIENT_URL=http://localhost:5173
   ```

   **faith-bliss-client/.env**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   ```

4. **Start the development servers**
   ```bash
   # Start the backend server
   cd faith-bliss-server
   pnpm run dev

   # Start the frontend (in a new terminal)
   cd faith-bliss-client
   pnpm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
faith-bliss/
├── faith-bliss-client/          # React frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── api/                 # API client configurations
│   │   ├── components/          # Reusable UI components
│   │   │   ├── auth/           # Authentication components
│   │   │   ├── dashboard/      # Dashboard-specific components
│   │   │   ├── onboarding/     # Onboarding flow components
│   │   │   ├── profile/        # Profile management components
│   │   │   └── Toast/          # Notification components
│   │   ├── contexts/           # React contexts
│   │   ├── firebase/           # Firebase configurations
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Layout components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── store/              # Zustand stores
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Utility functions
│   ├── package.json
│   └── tailwind.config.js
└── faith-bliss-server/          # Node.js backend
    ├── src/
    │   ├── config/             # Configuration files
    │   ├── controllers/        # Route controllers
    │   ├── middleware/         # Express middleware
    │   ├── models/             # MongoDB models
    │   ├── routes/             # API routes
    │   ├── socket/             # WebSocket handlers
    │   └── types/              # TypeScript definitions
    ├── uploads/                # File upload directory
    ├── package.json
    └── tsconfig.json
```

## 🔧 Available Scripts

### Client Scripts
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run lint` - Run ESLint
- `pnpm run preview` - Preview production build

### Server Scripts
- `pnpm run dev` - Start development server with nodemon
- `pnpm run build` - Compile TypeScript
- `pnpm run start` - Start production server

## 🔐 Authentication Flow

1. **Registration**: Users can sign up with email/password or Google OAuth
2. **Email Verification**: Firebase handles email verification
3. **JWT Tokens**: Server issues JWT tokens for API authentication
4. **Protected Routes**: Middleware validates tokens for secure endpoints
5. **Session Management**: Cookies store authentication state

## 💾 Database Schema

### User Model
```typescript
{
  _id: ObjectId,
  firebaseUid: String,
  email: String,
  displayName: String,
  profile: {
    basicInfo: {...},
    faith: {...},
    passions: [...],
    photos: [...]
  },
  preferences: {...},
  onboardingCompleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Match Model
```typescript
{
  _id: ObjectId,
  user1: ObjectId,
  user2: ObjectId,
  status: 'pending' | 'accepted' | 'declined',
  createdAt: Date
}
```

### Message Model
```typescript
{
  _id: ObjectId,
  matchId: ObjectId,
  senderId: ObjectId,
  content: String,
  timestamp: Date,
  read: Boolean
}
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/matches` - Get user matches

### Matches
- `GET /api/matches` - Get potential matches
- `POST /api/matches/:userId/like` - Like a user
- `POST /api/matches/:userId/pass` - Pass on a user

### Messages
- `GET /api/messages/:matchId` - Get messages for a match
- `POST /api/messages/:matchId` - Send a message

### File Upload
- `POST /api/uploads/photos` - Upload profile photos

## 🔄 Real-time Features

### WebSocket Events
- `connection` - User connects to chat
- `join-match` - Join a match's chat room
- `send-message` - Send a message
- `receive-message` - Receive a message
- `user-typing` - User is typing indicator
- `match-update` - Match status updates

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Deployment
1. Build the application: `pnpm run build`
2. Set production environment variables
3. Deploy to hosting service (Heroku, Railway, DigitalOcean, etc.)
4. Ensure MongoDB is accessible from production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with faith and love for the African Christian community
- Powered by FutureGRIN
- Special thanks to all contributors and beta testers

## 📞 Support

For support, email support@faithbliss.com or join our community Discord.

---

**FaithBliss** - Building faithful connections across Africa. 🌍❤️✝️
