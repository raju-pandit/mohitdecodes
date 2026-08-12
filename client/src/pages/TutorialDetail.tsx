import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Eye, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getTutorial } from '../services/tutorialService'
import { Tutorial } from '../types'
import { useTitle } from '../hooks/useTitle'

const TutorialDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  useTitle(tutorial?.title || 'Loading Tutorial...', tutorial?.excerpt || '')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const res = await getTutorial(slug!)
        setTutorial(res.data)
      } catch (err) {
        console.error('Error fetching tutorial details:', err)
        toast.error('Tutorial not found')
        navigate('/tutorials')
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchTutorial()
  }, [slug, navigate])

  if (loading) {
    return (
      <div className="container-max py-20 flex justify-center">
        <div className="spinner w-12 h-12" />
      </div>
    )
  }

  if (!tutorial) return null

  const formattedDate = tutorial.createdAt 
    ? new Date(tutorial.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recently'

  return (
    <div className="min-h-screen bg-dark-950 pb-20">
      <div className="container-max py-12 max-w-4xl">
        <Link to="/tutorials" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tutorials
        </Link>

        <div className="mb-6 flex flex-wrap gap-2">
          <span className="badge badge-primary">{tutorial.category}</span>
          <span className="badge badge-blue">{tutorial.difficulty}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-100 mb-6">
          {tutorial.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 py-4 border-y border-dark-800 text-xs md:text-sm text-slate-500 mb-10">
          {tutorial.author && (
            <div className="flex items-center gap-2">
              <img src={tutorial.author.avatar || 'https://ui-avatars.com/api/?name=Mohit'} alt={tutorial.author.name} className="w-7 h-7 rounded-full border border-dark-700" />
              <span className="font-semibold text-slate-400">{tutorial.author.name}</span>
            </div>
          )}
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formattedDate}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {tutorial.readingTime} min read</span>
          <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {tutorial.views} views</span>
        </div>

        <div className="prose prose-invert prose-dark max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{tutorial.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default TutorialDetail
