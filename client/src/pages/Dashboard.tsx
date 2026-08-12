import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, Flame, Bookmark, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Course, Blog } from '../types'
import { CourseCard } from '../components/CourseCard'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [savedBlogs, setSavedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [coursesRes, blogsRes] = await Promise.all([
          api.get('/courses'), // Get all courses, we will filter locally or via endpoint if supported
          api.get('/blogs')
        ])

        const allCourses: Course[] = coursesRes.data?.data || coursesRes.data || []
        const allBlogs: Blog[] = blogsRes.data?.data || blogsRes.data || []

        // Filter courses that this user is enrolled in
        const userEnrolledIds = user?.enrolledCourses?.map((ec: any) => ec.courseId?._id || ec.courseId || ec) || []
        const userEnrolled = allCourses.filter(c => userEnrolledIds.includes(c._id))
        setEnrolledCourses(userEnrolled)

        // Filter saved blogs
        const userSavedIds = user?.savedBlogs?.map((sb: any) => sb._id || sb) || []
        const userSaved = allBlogs.filter(b => userSavedIds.includes(b._id))
        setSavedBlogs(userSaved)
      } catch (err) {
        console.error('Error fetching dashboard details:', err)
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchUserData()
  }, [user])


  if (!user) return null

  return (
    <div className="container-max py-12 space-y-12">
      {/* User Info Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-dark-900 border border-dark-700 p-8 rounded-2xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-3xl shrink-0 border-2 border-primary-500">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-100">Welcome, {user.name}!</h1>
              {user.role === 'admin' && (
                <span className="badge badge-primary text-[10px] inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin
                </span>
              )}
            </div>
            <p className="text-slate-400 mt-1">Track your progress and continue learning.</p>
          </div>
        </div>

        {user.role === 'admin' && (
          <Link to="/admin" className="btn-primary py-3 px-6 rounded-xl text-sm font-semibold flex items-center gap-2">
            Go to Admin Panel <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border border-dark-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-700/10 text-primary-400 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-100">{enrolledCourses.length}</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Enrolled Courses</p>
          </div>
        </div>

        <div className="glass-card p-6 border border-dark-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-100">{user.completedLessons?.length || 0}</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Lessons Completed</p>
          </div>
        </div>

        <div className="glass-card p-6 border border-dark-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-100">{user.learningStreak || 0} days</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Active Streak</p>
          </div>
        </div>

        <div className="glass-card p-6 border border-dark-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
            <Bookmark size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-100">{savedBlogs.length}</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Saved Articles</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-100">Your Courses</h2>
          
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {Array(2).fill(0).map((_, i) => <div key={i} className="skeleton h-80 rounded-2xl" />)}
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {enrolledCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center border border-dark-700 bg-dark-900/30">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-300 mb-2">No Enrolled Courses</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                Explore our programming courses and kickstart your learning journey.
              </p>
              <Link to="/courses" className="btn-primary btn-sm inline-block">
                Browse Courses
              </Link>
            </div>
          )}
        </div>

        {/* Saved Blogs Sidebar */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-100">Saved Articles</h2>

          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
            </div>
          ) : savedBlogs.length > 0 ? (
            <div className="space-y-4">
              {savedBlogs.map(blog => (
                <div key={blog._id} className="glass-card p-4 border border-dark-700 hover:border-primary-500/30 transition-colors">
                  <span className="badge badge-primary text-[9px] mb-1.5">{blog.category}</span>
                  <Link to={`/blogs/${blog.slug}`}>
                    <h3 className="font-bold text-slate-200 hover:text-primary-400 transition-colors leading-snug">
                      {blog.title}
                    </h3>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center border border-dark-700 bg-dark-900/30 text-slate-500 text-sm">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              No saved articles yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
