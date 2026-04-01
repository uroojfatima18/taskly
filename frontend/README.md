---
title: Taskly Frontend
emoji: ✅
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 7860
---

# Taskly - Task Management App

Next.js frontend for the Taskly task management application.

## Features

- Create, update, delete tasks
- Mark tasks as complete
- User authentication
- Responsive design

## Getting Started (Local Development)

### 1. Install Dependencies
```bash
# Move into frontend folder
cd frontend

# Install node modules
npm install
```

### 2. Environment Variables
Make sure you have a `.env.local` file pointing to your backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
