import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, Flame, Bookmark, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { getInitials, hasCustomAvatar } from '../utils/formatters'
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-700 p-8 rounded-2xl shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-3xl shrink-0 border-2 border-purple-500 overflow-hidden shadow-md">
            {hasCustomAvatar(user.avatar) ? <img src={user.avatar} className="w-full h-full object-cover" /> : getInitials(user.name || '')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Welcome, {user.name}!</h1>
              {user.role === 'admin' && (
                <span className="badge badge-primary text-[10px] inline-flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin
                </span>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium">Track your progress and continue learning.</p>
          </div>
        </div>

        {user.role === 'admin' && (
          <Link to="/admin" className="btn-primary py-3 px-6 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md">
            Go to Admin Panel <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-700 shadow-sm flex items-center gap-4 transition-all">
          <div className="w-12 h-12 bg-purple-50 dark:bg-primary-700/10 text-purple-600 dark:text-primary-400 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{enrolledCourses.length}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Enrolled Courses</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-700 shadow-sm flex items-center gap-4 transition-all">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{user.completedLessons?.length || 0}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Lessons Completed</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-700 shadow-sm flex items-center gap-4 transition-all">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{user.learningStreak || 0} days</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Streak</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-700 shadow-sm flex items-center gap-4 transition-all">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
            <Bookmark size={24} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{savedBlogs.length}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Saved Articles</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Your Courses</h2>
          
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
            <div className="p-12 text-center border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900/30 rounded-2xl shadow-sm">
              <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-300 mb-2">No Enrolled Courses</h3>
              <p className="text-sm text-slate-500 mb-6">Explore our catalog and start learning today!</p>
              <Link to="/courses" className="btn-primary py-2.5 px-6 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                Browse Courses <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>

        {/* Learning Activity & Bookmarks */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Saved Articles</h2>
          
          {savedBlogs.length > 0 ? (
            <div className="space-y-4">
              {savedBlogs.map(blog => (
                <div key={blog._id} className="p-4 rounded-xl border border-slate-200/90 dark:border-dark-700 bg-white dark:bg-dark-900/40 hover:border-purple-500/40 dark:hover:border-primary-500/40 transition-all flex items-center justify-between gap-4 shadow-sm">
                  <div className="min-w-0">
                    <Link to={`/blogs/${blog.slug}`} className="font-bold text-slate-900 dark:text-slate-200 hover:text-purple-600 dark:hover:text-primary-400 truncate block text-sm transition-colors">
                      {blog.title}
                    </Link>
                    <span className="text-xs text-slate-500 font-medium">{blog.category}</span>
                  </div>
                  <Link to={`/blogs/${blog.slug}`} className="text-purple-600 dark:text-primary-400 hover:text-purple-700 p-2 shrink-0">
                    <ArrowRight size={16} />
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
