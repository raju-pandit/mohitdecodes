import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProjects } from '../services/projectService'
import { Project } from '../types'
import { ProjectCard } from '../components/ProjectCard'

const Categories = [
  { label: 'All Projects', value: '' },
  { label: 'Frontend', value: 'Frontend' },
  { label: 'Backend', value: 'Backend' },
  { label: 'Full Stack', value: 'Full Stack' },
]

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const params: Record<string, any> = {}
        if (category) params.category = category

        const res = await getProjects(params)
        setProjects(res.data || [])
      } catch (err) {
        console.error('Error fetching projects:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [category])

  return (
    <div className="container-max py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Build <span className="gradient-text">Projects</span>
        </h1>
        <p className="text-xl text-slate-400">
          Build portfolio-ready, fully functional full-stack projects to test and showcase your skills.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex justify-center mb-12">
        <div className="flex bg-dark-900 border border-dark-800 p-1.5 rounded-full overflow-x-auto no-scrollbar max-w-md w-full">
          {Categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`flex-1 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                category === cat.value
                  ? 'bg-primary-700 text-white shadow-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="skeleton h-80 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500">
          No projects found. Check back later!
        </div>
      )}
    </div>
  )
}

export default Projects
