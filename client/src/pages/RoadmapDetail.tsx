import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, MapPin, Award, CheckCircle, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { getRoadmap, updateProgress } from '../services/roadmapService'
import { getMe } from '../services/authService'
import { Roadmap } from '../types'
import { useAuth } from '../context/AuthContext'
import { useTitle } from '../hooks/useTitle'

const RoadmapDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  useTitle(roadmap?.title || 'Loading Roadmap...', roadmap?.description || '')
  const [loading, setLoading] = useState(true)
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await getRoadmap(slug!)
        setRoadmap(res.data)
      } catch (err) {
        console.error('Error fetching roadmap details:', err)
        toast.error('Roadmap not found')
        navigate('/roadmaps')
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchRoadmap()
  }, [slug, navigate])

  const userProgress = user?.roadmapProgress?.find(
    (rp: any) => rp.roadmapId === roadmap?._id || rp.roadmapId?._id === roadmap?._id
  )

  const completedSteps = userProgress?.completedSteps || []
  const stepsCount = roadmap?.steps?.length || 0
  const completionPercentage = stepsCount > 0 
    ? Math.round((completedSteps.length / stepsCount) * 100) 
    : 0

  const handleStepToggle = async (stepId: string, isCompleted: boolean) => {
    if (!user) {
      toast.error('Please log in to track your progress')
      return
    }
    try {
      await updateProgress(roadmap?._id!, stepId, isCompleted)
      
      // Update profile locally to keep UIs in sync
      const res = await getMe()
      if (res.data && res.data.user) {
        updateUser(res.data.user)
      }
      toast.success(isCompleted ? 'Step completed!' : 'Step marked incomplete')
    } catch {
      toast.error('Failed to update progress')
    }
  }

  if (loading) {
    return (
      <div className="container-max py-20 flex justify-center">
        <div className="spinner w-12 h-12" />
      </div>
    )
  }

  if (!roadmap) return null

  const stepsSorted = [...(roadmap.steps || [])].sort((a, b) => a.order - b.order)
  const roadmapColor = roadmap.color || '#7c3aed'

  return (
    <div className="min-h-screen bg-dark-950 pb-20">
      {/* Header Info */}
      <div className="bg-gradient-to-b from-dark-900 to-dark-950 py-12 px-4 border-b border-dark-800">
        <div className="container-max">
          <Link to="/roadmaps" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Roadmaps
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="badge badge-primary mb-3">{roadmap.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">{roadmap.title}</h1>
              <p className="text-slate-400 max-w-2xl text-sm md:text-base">{roadmap.description}</p>
              
              <div className="flex flex-wrap gap-4 mt-4 text-xs md:text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-400" /> {roadmap.estimatedDuration}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary-400" /> {stepsCount} steps</span>
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-yellow-500" /> {roadmap.difficulty}</span>
              </div>
            </div>

            {/* Progress bar */}
            {user && (
              <div className="w-full md:w-72 bg-dark-900 border border-dark-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span className="text-slate-300">Your Progress</span>
                  <span className="text-primary-400">{completionPercentage}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${completionPercentage}%`, backgroundColor: roadmapColor }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-right">
                  {completedSteps.length} of {stepsCount} steps completed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Steps timeline */}
      <div className="container-max py-12 max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-100 mb-10">Roadmap Path</h2>

        {stepsSorted.length > 0 ? (
          <div className="relative border-l-2 border-dark-800 ml-4 md:ml-6 pl-6 md:pl-10 space-y-12">
            {stepsSorted.map((step) => {
              const isStepCompleted = completedSteps.includes(step._id)
              return (
                <div key={step._id} className="relative">
                  {/* Timeline point */}
                  <span 
                    className="absolute -left-[35px] md:-left-[51px] top-1.5 w-6 h-6 rounded-full border-2 border-dark-800 flex items-center justify-center font-bold text-xs"
                    style={{ 
                      backgroundColor: isStepCompleted ? roadmapColor : '#0f172a',
                      borderColor: isStepCompleted ? roadmapColor : '#334155',
                      color: isStepCompleted ? '#fff' : '#94a3b8'
                    }}
                  >
                    {isStepCompleted ? '✓' : step.order}
                  </span>

                  <div className="glass-card p-6 border border-dark-700 bg-dark-900/40">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-200 mb-2">{step.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">{step.description}</p>
                      </div>

                      {/* Checkbox tracker */}
                      {user && (
                        <button
                          onClick={() => handleStepToggle(step._id, !isStepCompleted)}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all duration-200 flex-shrink-0 ${
                            isStepCompleted 
                              ? 'bg-green-500/20 border-green-500 text-green-400 shadow-glow-cyan' 
                              : 'border-dark-600 text-transparent hover:border-slate-400'
                          }`}
                        >
                          <CheckCircle className="w-5 h-5 fill-current" />
                        </button>
                      )}
                    </div>

                    {/* Resources */}
                    {step.resources && step.resources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-dark-800/80">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2.5">Recommended Resources</p>
                        <div className="flex flex-wrap gap-3">
                          {step.resources.map((resource: any, ri: number) => (
                            <a
                              key={ri}
                              href={resource.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-dark-800 border border-dark-700 rounded-lg hover:border-slate-600 text-xs text-slate-300 font-medium transition-colors"
                            >
                              {resource.title} <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="glass-card p-12 text-center text-slate-500">
            No steps listed in this roadmap yet. Check back soon!
          </div>
        )}
      </div>
    </div>
  )
}

export default RoadmapDetail
