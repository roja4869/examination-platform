# ExamPro - Online Quiz Platform

A full-stack online examination platform built with Next.js, Node.js, Express, and Turso (SQLite).

## Features

- **Authentication & RBAC**: Secure JWT-based login for Admins and Students.
- **Admin Module**:
  - CRUD Quizzes (Title, Duration, Attempt Limits).
  - Multiple Question Types: MCQ, Short Answer, Coding.
  - Analytics & Leaderboard management.
- **Student Module**:
  - Quiz browsing and instant attempts.
  - Real-time countdown timer with auto-submit.
  - Integrated Monaco Code Editor for programming tasks.
  - Instant scoring and ranking.
- **UI/UX**: Premium glassmorphism design, dark mode support, and responsive layouts.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Framer Motion, React Hook Form, Lucide.
- **Backend**: Node.js, Express, JWT, Bcrypt, LibSQL (Turso/SQLite).
- **Database**: Turso (Production) / SQLite (Local).

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository.
2. Install dependencies for root, client, and server:
   \`\`\`bash
   npm install
   cd client && npm install
   cd ../server && npm install
   \`\`\`
3. Set up environment variables:
   - Create \`server/.env\`:
     \`\`\`env
     PORT=5000
     JWT_SECRET=your_secret
     DATABASE_URL=file:local.db
     FRONTEND_URL=http://localhost:3000
     \`\`\`

### Running Locally

From the root directory, run:
\`\`\`bash
npm run dev
\`\`\`
This will start both the Next.js frontend (port 3000) and Express backend (port 5000).

### Seeding Data

To populate the database with initial admin and student accounts:
\`\`\`bash
cd server && npm run seed
\`\`\`
**Default Credentials:**
- Admin: \`admin@test.com\` / \`admin123\`
- Student: \`student@test.com\` / \`student123\`

## Deployment

### Frontend (Vercel)
1. Push the \`client\` folder or the entire repo.
2. Set Build Command: \`npm run build\`
3. Set Output Directory: \`.next\`
4. Set Env Var: \`NEXT_PUBLIC_API_URL\` to your backend URL.

### Backend (Render / Railway)
1. Deploy the \`server\` folder.
2. Set Start Command: \`npm start\`
3. Set Env Vars: \`DATABASE_URL\`, \`JWT_SECRET\`, \`FRONTEND_URL\`.

### Database (Turso)
1. Create a database on Turso.
2. Get the connection URL and Auth Token.
3. Update \`DATABASE_URL\` and add \`DATABASE_AUTH_TOKEN\` in backend env vars.
