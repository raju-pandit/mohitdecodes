import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { getCourses } from '../services/courseService'
import { Course } from '../types'
import { CourseCard } from '../components/CourseCard'
import { CourseCardSkeleton } from '../components/ui/SkeletonLoader'
import useDebounce from '../hooks/useDebounce'

const Categories = [
  { label: 'All Categories', value: '' },
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'React.js', value: 'React' },
  { label: 'Node.js', value: 'Node' },
  { label: 'MongoDB', value: 'MongoDB' },
  { label: 'MERN Stack', value: 'MERN' },
  { label: 'Frontend', value: 'Frontend' },
  { label: 'Backend', value: 'Backend' },
  { label: 'DSA', value: 'DSA' },
]

const Difficulties = [
  { label: 'All Levels', value: '' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
]

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [activeTab, setActiveTab] = useState<'premium' | 'free'>('premium')
  const [sort, setSort] = useState('-createdAt')

  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const params: Record<string, any> = { sort }
        if (debouncedSearch) params.search = debouncedSearch
        if (category) params.category = category
        if (difficulty) params.difficulty = difficulty
        if (activeTab === 'free') params.isFree = true
        if (activeTab === 'premium') params.isFree = false

        const res = await getCourses(params)
        setCourses(res.data || [])
      } catch (err) {
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [debouncedSearch, category, difficulty, activeTab, sort])

  return (
    <div className="container-max py-12">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Explore <span className="gradient-text">Courses</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Level up your skills with our comprehensive, project-based courses designed for modern developers.
        </p>
      </div>

      {/* Course Type Tabs */}
      <div className="flex border-b border-dark-800 mb-8 pb-px">
        <button
          onClick={() => setActiveTab('premium')}
          className={`pb-3 text-lg font-bold transition-all relative px-2 ${
            activeTab === 'premium' ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Premium Courses
          {activeTab === 'premium' && (
            <motion.div layoutId="course-type-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('free')}
          className={`ml-6 pb-3 text-lg font-bold transition-all relative px-2 ${
            activeTab === 'free' ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Free Courses
          {activeTab === 'free' && (
            <motion.div layoutId="course-type-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          )}
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search courses by title or tags..."
            className="input pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input py-3 rounded-xl bg-dark-800 border-dark-700 min-w-[140px] text-sm text-slate-300"
          >
            {Categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="input py-3 rounded-xl bg-dark-800 border-dark-700 min-w-[140px] text-sm text-slate-300"
          >
            {Difficulties.map(diff => (
              <option key={diff.value} value={diff.value}>{diff.label}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input py-3 rounded-xl bg-dark-800 border-dark-700 min-w-[140px] text-sm text-slate-300"
          >
            <option value="-createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-students">Popularity</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, i) => <CourseCardSkeleton key={i} />)}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-dark-900/30 rounded-2xl border border-dark-700 max-w-lg mx-auto">
          <p className="text-xl text-gray-400 mb-4">No courses found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setCategory('')
              setDifficulty('')
              setActiveTab('premium')
            }}
            className="btn-outline btn-sm"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Courses
