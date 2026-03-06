# Project Chat App

A full-stack real-time chat application with user authentication, profile image upload, and one-to-one messaging.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, DaisyUI, Zustand, Axios, React Router, Socket.IO Client
- Backend: Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT, Cookie Parser, CORS, Cloudinary
- Tooling: ESLint, Nodemon

## Project Structure

- `backend/` - Express API, authentication, messaging routes, MongoDB models, Socket.IO server
- `frontend/` - React client app, chat UI components, Zustand stores, routing

## Features

- User signup/login/logout with JWT in HTTP-only cookies
- Auth persistence check (`/api/auth/check`)
- Profile image update with Cloudinary
- User list and direct messages
- Real-time message delivery and online users status with Socket.IO
- Theme handling on frontend

## Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB connection string
- Cloudinary account/API keys

## Environment Variables (Backend)

Create `backend/.env` with:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

## Install Dependencies

From the project root:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Run the App

1. Start backend:

```bash
cd backend
npm run dev
```

2. Start frontend (new terminal):

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` and backend is expected on `http://localhost:5001`.

## API Prefixes

- Auth routes: `/api/auth`
- Message routes: `/api/messages`

## Notes

- Frontend API base URL is configured in `frontend/src/lib/axios.js`.
- CORS and Socket.IO are configured for frontend localhost (`5173`) in backend.
