# Task Manager Application (MERN Stack)

A beginner-friendly full-stack Task Manager application built using the MERN stack (MongoDB, Express, React, Node.js). This project includes a complete authentication system with OTP email verification, secure password handling, and full CRUD operations for tasks.

## Features

- **Authentication System:**
  - Signup with email verification (OTP sent via Nodemailer)
  - Secure login with JWT and hashed passwords
  - Forgot/Reset Password via email OTP
- **Task Management:**
  - Create, Read, Update, and Delete tasks
  - Track task status (Todo, In Progress, Completed) and priority (Low, Medium, High)
  - Add optional due dates
- **Dashboard UI:**
  - Search tasks by title
  - Filter tasks by status
  - Clean and responsive Vanilla CSS interface

## Prerequisites

Before running this project, make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally on default port 27017, or a MongoDB Atlas URI)
- An SMTP email service (e.g., Ethereal Email, Gmail App Password)

## Installation & Setup

### 1. Clone or Download the Repository
Open your terminal and navigate to the project directory:
```bash
cd task-manager
```

### 2. Backend Setup
Navigate into the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Configure Environment Variables:
1. Copy the `.env.example` file or create a new `.env` file in the `backend` directory.
2. Ensure you have the following variables set up:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=your_super_secret_jwt_key
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
EMAIL_USER=your_email@ethereal.email
EMAIL_PASS=your_email_password
```
*(Note: You can generate test SMTP credentials quickly using [Ethereal Email](https://ethereal.email/))*

Start the Backend Server:
```bash
# This will run the server on http://localhost:5000
node server.js
```

### 3. Frontend Setup
Open a **new terminal window**, navigate to the `frontend` directory, and install dependencies:
```bash
cd task-manager/frontend
npm install
```

Start the Frontend Development Server:
```bash
# This will run the React app, usually on http://localhost:5173
npm run dev
```

## Folder Structure

```
task-manager/
├── backend/
│   ├── config/          # DB connection setup
│   ├── controllers/     # API logic (Auth, Tasks)
│   ├── middleware/      # JWT verification middleware
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # Express Routes
│   ├── utils/           # Nodemailer service
│   ├── server.js        # Entry point for backend
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance setup
    │   ├── components/  # Reusable UI components (Navbar, Forms)
    │   ├── context/     # React Context for Auth state
    │   ├── pages/       # Application Pages (Login, Dashboard, etc.)
    │   ├── App.jsx      # Main routing setup
    │   ├── main.jsx     # React entry point
    │   └── index.css    # Global and component styles
    └── package.json
```

## Common Errors & Fixes

1. **MongoDB Connection Error:**
   - *Fix:* Ensure your local MongoDB service is running. If you are using MongoDB Compass, connect to it once to verify it is active.

2. **CORS Error in Frontend:**
   - *Fix:* Ensure the backend is running on `http://localhost:5000` and the frontend `axios.js` base URL is pointing exactly to `http://localhost:5000/api`.

3. **Email OTP Not Sending:**
   - *Fix:* Check your `.env` file credentials. If using Gmail, you MUST use an "App Password" (generated in your Google Account security settings) rather than your normal account password. For beginners, using [ethereal.email](https://ethereal.email/) is highly recommended for testing.
