import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Clock, Award, BookOpen } from 'lucide-react'
import { getTutorials } from '../services/tutorialService'
import { Tutorial } from '../types'
import { TutorialCardSkeleton } from '../components/ui/SkeletonLoader'
import useDebounce from '../hooks/useDebounce'

const Categories = [
  { label: 'All Categories', value: '' },
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'React.js', value: 'React' },
  { label: 'Node.js', value: 'Node.js' },
  { label: 'MongoDB', value: 'MongoDB' },
  { label: 'Frontend', value: 'Frontend' },
  { label: 'Backend', value: 'Backend' },
]

const Difficulties = [
  { label: 'All Levels', value: '' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
]

const Tutorials: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')

  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchTutorials = async () => {
      setLoading(true)
      try {
        const params: Record<string, any> = {}
        if (debouncedSearch) params.search = debouncedSearch
        if (category) params.category = category
        if (difficulty) params.difficulty = difficulty

        const res = await getTutorials(params)
        setTutorials(res.data || [])
      } catch (err) {
        console.error('Error fetching tutorials:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTutorials()
  }, [debouncedSearch, category, difficulty])

  return (
    <div className="container-max py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white">
          Tutorial <span className="gradient-text">Library</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Browse through our free bite-sized programming tutorials to learn concepts quickly.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search tutorials by title..."
            className="input pl-12 bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700 shadow-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input py-3 rounded-xl bg-white dark:bg-dark-800 border-slate-200 dark:border-dark-700 min-w-[150px] text-sm text-slate-800 dark:text-slate-300 shadow-xs"
          >
            {Categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="input py-3 rounded-xl bg-white dark:bg-dark-800 border-slate-200 dark:border-dark-700 min-w-[150px] text-sm text-slate-800 dark:text-slate-300 shadow-xs"
          >
            {Difficulties.map(diff => (
              <option key={diff.value} value={diff.value}>{diff.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {Array(6).fill(0).map((_, i) => <TutorialCardSkeleton key={i} />)}
        </div>
      ) : tutorials.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {tutorials.map((tutorial, idx) => (
            <motion.div
              key={tutorial._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-700 shadow-sm hover:shadow-xl dark:shadow-none hover:border-purple-500/40 dark:hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="badge badge-primary text-[10px] font-semibold">{tutorial.category}</span>
                    <span className="badge badge-blue text-[10px] font-semibold">{tutorial.difficulty}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 hover:text-purple-600 dark:hover:text-primary-400 transition-colors">
                    <Link to={`/tutorials/${tutorial.slug}`}>{tutorial.title}</Link>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{tutorial.excerpt}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {tutorial.readingTime} min read</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {tutorial.views} views</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-dark-900/30 rounded-2xl border border-slate-200 dark:border-dark-700 max-w-lg mx-auto shadow-sm">
          <p className="text-xl text-slate-600 dark:text-gray-400 mb-4 font-medium">No tutorials found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setCategory('')
              setDifficulty('')
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

export default Tutorials
