import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Github, ExternalLink, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import { getProject } from '../services/projectService'
import { Project } from '../types'
import { useTitle } from '../hooks/useTitle'

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  useTitle(project?.title || 'Loading Project...', project?.description || '')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProject(slug!)
        setProject(res.data)
      } catch (err) {
        console.error('Error fetching project details:', err)
        toast.error('Project not found')
        navigate('/projects')
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchProject()
  }, [slug, navigate])

  if (loading) {
    return (
      <div className="container-max py-20 flex justify-center">
        <div className="spinner w-12 h-12" />
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="min-h-screen bg-dark-950 pb-20">
      <div className="container-max py-12 max-w-4xl">
        <Link to="/projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        {project.image && (
          <img src={project.image} alt={project.title} className="w-full h-80 object-cover rounded-2xl mb-8 border border-dark-800" />
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="badge badge-primary">{project.category}</span>
              <span className="badge badge-blue">{project.difficulty}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-100">
              {project.title}
            </h1>
          </div>

          <div className="flex gap-4 flex-shrink-0">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary py-3 px-5 inline-flex items-center gap-2 text-sm rounded-xl">
                <Github className="w-4 h-4" /> GitHub Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary py-3 px-5 inline-flex items-center gap-2 text-sm rounded-xl">
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
          </div>
        </div>

        <div className="glass-card p-8 border border-dark-700 bg-dark-900/40 mb-8">
          <h2 className="text-xl font-bold text-slate-200 mb-4">Project Overview</h2>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
            {project.description}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-300 mb-3">Technologies Used</h3>
          <div className="flex flex-wrap gap-2.5">
            {project.technologies?.map(tech => (
              <span key={tech} className="px-3.5 py-1.5 bg-dark-800 border border-dark-700 rounded-lg text-sm text-slate-300 font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
