import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getRoadmaps } from '../services/roadmapService'
import { Roadmap } from '../types'
import { RoadmapCard } from '../components/RoadmapCard'

const Roadmaps: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await getRoadmaps()
        setRoadmaps(res.data || [])
      } catch (err) {
        console.error('Error fetching roadmaps:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRoadmaps()
  }, [])

  return (
    <div className="container-max py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Learning <span className="gradient-text">Roadmaps</span>
        </h1>
        <p className="text-xl text-slate-400">
          Step-by-step developer guides and curriculum paths to help you master skills in the correct order.
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="skeleton h-72 rounded-2xl" />
          ))}
        </div>
      ) : roadmaps.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadmaps.map((roadmap, idx) => (
            <motion.div
              key={roadmap._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <RoadmapCard roadmap={roadmap} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500">
          No roadmaps available at the moment.
        </div>
      )}
    </div>
  )
}

export default Roadmaps
