# Taskly - Modern Task Management App

A calm, modern task manager built to help you plan with clarity and finish with confidence.

## Overview

Taskly is a full-stack task management application with a beautiful dark theme, smooth animations, and an intuitive user interface. Built with modern web technologies, it provides a seamless experience for managing your daily tasks and staying organized.

## Features

### Core Functionality
- **Task Management** - Create, read, update, and delete tasks
- **Status Tracking** - Track tasks through To Do, In Progress, and Done states
- **Search & Filter** - Quickly find tasks with real-time search and status filters
- **Due Dates** - Set optional due dates for your tasks
- **User Authentication** - Secure JWT-based authentication with Better Auth

### User Experience
- **Dark Theme** - Beautiful dark navy background with purple/cyan gradients
- **Glassmorphic UI** - Modern glassmorphic cards with subtle effects
- **Smooth Animations** - Professional entrance and hover animations throughout
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Empty States** - Helpful messages when no tasks exist

### Dashboard Features
- Task statistics (total count and completed count)
- Real-time search across task titles and descriptions
- Filter tabs for All, To Do, In Progress, and Done
- Quick task creation modal
- Clean, distraction-free interface

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Better Auth** - Authentication client
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Modern Python web framework
- **SQLModel** - SQL databases with Python objects
- **PostgreSQL** - Relational database
- **Better Auth** - JWT authentication
- **Pydantic** - Data validation

## Project Structure

```
hackthon-todo2/
├── frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── dashboard/         # Dashboard page
│   │   │   ├── login/             # Login page
│   │   │   └── signup/            # Signup page
│   │   ├── components/     # React components
│   │   │   ├── ui/                # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── context/        # React context providers
│   │   ├── lib/            # Utility functions and API client
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── tailwind.config.ts  # Tailwind configuration
│
├── backend/                # FastAPI backend application
│   ├── main.py            # FastAPI app entry point
│   ├── models/            # SQLModel database models
│   ├── routes/            # API route handlers
│   └── .env               # Environment variables
│
├── specs/                 # Feature specifications
│   ├── features/          # Feature specs
│   └── api/              # API specs
│
└── README.md             # This file
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd hackthon-todo2
```

#### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
# Create .env file with:
DATABASE_URL=postgresql://user:password@localhost:5432/taskly
SECRET_KEY=your-secret-key-here

# Run database migrations (if applicable)
# python migrate.py

# Start the backend server
uvicorn main:app --reload
```

Backend will be running at `http://localhost:8000`

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
# Create .env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the development server
npm run dev
```

Frontend will be running at `http://localhost:3000`

## Development

### Frontend Development

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Backend Development

```bash
cd backend

# Run development server with hot reload
uvicorn main:app --reload

# Run tests
pytest

# Format code
black .

# Type checking
mypy .
```

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/taskly
SECRET_KEY=your-secret-key-here
BETTER_AUTH_SECRET=your-auth-secret-here
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task


### Components

- **GradientText** - Text with purple/cyan gradients
- **GlassCard** - Glassmorphic card container
- **IconCircle** - Circular icon backgrounds with badges
- **Button** - Primary, secondary, and ghost variants

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Design inspiration from Lovable
- Icons by [Lucide](https://lucide.dev)
- Built with [Next.js](https://nextjs.org) and [FastAPI](https://fastapi.tiangolo.com)

---

**Made with 💜 by Urooj**
