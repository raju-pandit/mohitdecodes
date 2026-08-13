# MohitDecodes — Full Stack Developer Education Platform

> **Learn. Build. Decode.** — A production-ready developer education platform built with the MERN Stack.

## 🚀 Tech Stack

### Frontend
- **React.js** + **TypeScript** + **Vite**
- **Tailwind CSS** — Premium dark UI
- **Framer Motion** — Smooth animations
- **React Router v6** — Client-side routing
- **Axios** — API communication
- **React Hook Form** + **Zod** — Form validation
- **Lucide React** — Icons
- **React Hot Toast** — Notifications

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT Authentication** (HTTP-only cookies)
- **bcryptjs** — Password hashing
- **Helmet** + **CORS** + **Rate Limiting** — Security
- **Multer** — File uploads (Cloudinary-ready)
- **Nodemailer** — Email (integration-ready)

---

## 📁 Project Structure

```
mohitdecodes/
├── client/                    # React Frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Button, Card, Badge, Modal, Skeleton
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── CourseCard.tsx
│   │   │   ├── BlogCard.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── RoadmapCard.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   ├── SearchModal.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── AdminRoute.tsx
│   │   ├── pages/            # All page components
│   │   │   ├── Home.tsx
│   │   │   ├── Courses.tsx
│   │   │   ├── CourseDetail.tsx
│   │   │   ├── Tutorials.tsx
│   │   │   ├── Blogs.tsx
│   │   │   ├── BlogDetail.tsx
│   │   │   ├── Roadmaps.tsx
│   │   │   ├── RoadmapDetail.tsx
│   │   │   ├── Resources.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── YouTube.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── admin/        # Admin panel pages
│   │   ├── layouts/          # MainLayout, AdminLayout
│   │   ├── context/          # AuthContext
│   │   ├── services/         # API service files
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helper functions
│   │   └── types/            # TypeScript types
│   └── .env
│
├── server/                   # Express Backend
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/          # Business logic
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routes
│   ├── middleware/           # Auth, error handler, upload
│   ├── utils/
│   │   └── seed.js          # Database seeder
│   ├── uploads/             # Local file storage
│   ├── server.js            # Entry point
│   └── .env
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18.x
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure Environment

**Server** (`server/.env`):
```env


NODE_ENV=development

```



### 3. Seed Database

```bash
cd server
npm run seed
```

This creates:
- 8 courses (JavaScript, React, Node.js, MERN, DSA, MongoDB, TypeScript, Git)
- 10 tutorials
- 8 blogs
- 5 roadmaps (Frontend, Backend, MERN, DSA, Full Stack)
- 8 resources (PDFs, cheat sheets)
- 8 projects
- 6 testimonials
- 1 admin user + sample users

### 4. Start Development

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```



---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Forgot password |
| POST | `/api/auth/reset-password/:token` | Reset password |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses (filter/search/paginate) |
| GET | `/api/courses/:slug` | Get course by slug |
| POST | `/api/courses` | Create course (admin) |
| PUT | `/api/courses/:id` | Update course (admin) |
| DELETE | `/api/courses/:id` | Delete course (admin) |
| POST | `/api/courses/:id/enroll` | Enroll in course |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=react` | Global search across all content |

> All CRUD endpoints follow same pattern for: `/api/tutorials`, `/api/blogs`, `/api/resources`, `/api/projects`, `/api/roadmaps`

---

## 🛡️ Security Features

- ✅ JWT authentication with HTTP-only cookies
- ✅ Password hashing with bcryptjs
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Rate limiting (200/15min general, 20/15min auth)
- ✅ MongoDB sanitization (no-SQL injection)
- ✅ Input validation
- ✅ Role-based authorization (user/admin)
- ✅ Environment variables for secrets

---

## 🎨 Features

- 🌙 **Dark Theme** by default (premium developer aesthetic)
- 📱 **Fully Responsive** (320px to 1440px+)
- ⚡ **Fast** — Vite build + lazy loading + code splitting
- 🔍 **Global Search** across all content types
- 📊 **User Dashboard** with progress tracking
- 🗺️ **Interactive Roadmaps** with progress saving
- 📚 **Course Curriculum** with lesson tracking
- 💾 **Resource Library** with download tracking
- 📧 **Newsletter** subscription system
- 🎯 **Admin CMS** with full CRUD
- 🌟 **Testimonials** carousel
- 🔔 **Toast Notifications**

---

## 🚀 Deployment

### Backend (Railway/Render)
1. Set environment variables
2. Deploy server directory
3. Set `NODE_ENV=production`

### Frontend (Vercel)
1. Set `VITE_API_URL` to your backend URL
2. Deploy client directory

---

## 📄 License

MIT © MohitDecodes 2024

---

Made with ❤️ by **MohitDecodes** — Learn. Build. Decode.
