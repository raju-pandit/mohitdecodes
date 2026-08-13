import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { getBlogs } from '../services/blogService'
import { Blog } from '../types'
import { BlogCard } from '../components/BlogCard'
import { BlogCardSkeleton } from '../components/ui/SkeletonLoader'
import useDebounce from '../hooks/useDebounce'

const Categories = [
  { label: 'All Categories', value: '' },
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'React.js', value: 'React' },
  { label: 'Node.js', value: 'Node.js' },
  { label: 'MongoDB', value: 'MongoDB' },
  { label: 'Full Stack', value: 'Full Stack' },
  { label: 'Career', value: 'Career' },
  { label: 'Frontend', value: 'Frontend' },
]

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')

  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const params: Record<string, any> = {}
        if (debouncedSearch) params.search = debouncedSearch
        if (category) params.category = category

        const res = await getBlogs(params)
        setBlogs(res.data || [])
      } catch (err) {
        console.error('Error fetching blogs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [debouncedSearch, category])

  return (
    <div className="container-max py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white">
          Latest <span className="gradient-text">Articles</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Discover tips, tutorials, and insights about web development and software engineering.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search articles by title..."
            className="input pl-12 bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700 shadow-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input py-3 rounded-xl bg-white dark:bg-dark-800 border-slate-200 dark:border-dark-700 min-w-[180px] text-sm text-slate-800 dark:text-slate-300 shadow-xs"
          >
            {Categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, i) => <BlogCardSkeleton key={i} />)}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-dark-900/30 rounded-2xl border border-slate-200 dark:border-dark-700 max-w-lg mx-auto shadow-sm">
          <p className="text-xl text-slate-600 dark:text-gray-400 mb-4 font-medium">No articles found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setCategory('')
            }}
            className="btn-outline btn-sm cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Blogs
