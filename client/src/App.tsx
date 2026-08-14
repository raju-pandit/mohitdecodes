import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const Tutorials = lazy(() => import('./pages/Tutorials'))
const TutorialDetail = lazy(() => import('./pages/TutorialDetail'))
const Blogs = lazy(() => import('./pages/Blogs'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const Roadmaps = lazy(() => import('./pages/Roadmaps'))
const RoadmapDetail = lazy(() => import('./pages/RoadmapDetail'))
const Resources = lazy(() => import('./pages/Resources'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const YouTube = lazy(() => import('./pages/YouTube'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'))
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'))
const AdminTutorials = lazy(() => import('./pages/admin/AdminTutorials'))
const AdminResources = lazy(() => import('./pages/admin/AdminResources'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'))
const AdminRoadmaps = lazy(() => import('./pages/admin/AdminRoadmaps'))
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'))
const AdminTopmate = lazy(() => import('./pages/admin/AdminTopmate'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'))
const AdminNewsletter = lazy(() => import('./pages/admin/AdminNewsletter'))

const NotFound = lazy(() => import('./pages/NotFound'))

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-dark-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="spinner" />
      <p className="text-slate-500 text-sm">Loading...</p>
    </div>
  </div>
)

import ErrorBoundary from './components/ErrorBoundary'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#1e293b' },
              duration: 4000,
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#1e293b' },
              duration: 5000,
            },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/tutorials/:slug" element={<TutorialDetail />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:slug" element={<BlogDetail />} />
              <Route path="/roadmaps" element={<Roadmaps />} />
              <Route path="/roadmaps/:slug" element={<RoadmapDetail />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/youtube" element={<YouTube />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ForgotPassword />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              
              {/* Protected user routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/blogs" element={<AdminBlogs />} />
                <Route path="/admin/tutorials" element={<AdminTutorials />} />
                <Route path="/admin/resources" element={<AdminResources />} />
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/admin/roadmaps" element={<AdminRoadmaps />} />
                <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                <Route path="/admin/topmate" element={<AdminTopmate />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route path="/admin/newsletter" element={<AdminNewsletter />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
