import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { getResources, downloadResource } from '../services/resourceService'
import { Resource } from '../types'
import useDebounce from '../hooks/useDebounce'

const Categories = [
  { label: 'All Resources', value: '' },
  { label: 'Cheat Sheets', value: 'Cheat Sheet' },
  { label: 'Interview Questions', value: 'Interview Questions' },
  { label: 'Study Notes', value: 'Notes' },
  { label: 'Roadmaps', value: 'Roadmap' },
  { label: 'Templates', value: 'Template' },
]

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [downloading, setDownloading] = useState<string | null>(null)

  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true)
      try {
        const params: Record<string, any> = {}
        if (category) params.category = category
        if (debouncedSearch) params.search = debouncedSearch

        const res = await getResources(params)
        setResources(res.data || [])
      } catch (err) {
        console.error('Error fetching resources:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchResources()
  }, [category, debouncedSearch])

  const handleDownload = async (id: string, title: string) => {
    setDownloading(id)
    try {
      const res = await downloadResource(id)
      const fileUrl = res.data?.fileUrl || (res as any).fileUrl
      
      if (fileUrl) {
        // Trigger file download / open in new tab
        window.open(fileUrl, '_blank')
        toast.success(`Downloading ${title}...`)
        
        // Increment download counter locally
        setResources(prev =>
          prev.map(r => r._id === id ? { ...r, downloads: r.downloads + 1 } : r)
        )
      } else {
        toast.error('Download link not found')
      }
    } catch {
      toast.error('Failed to trigger download')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="container-max py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Developer <span className="gradient-text">Resources</span>
        </h1>
        <p className="text-xl text-slate-400">
          Free premium developer resources: study guides, cheat sheets, templates, and resume guides.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search resources by title..."
            className="input pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input py-3 rounded-xl bg-dark-800 border-dark-700 min-w-[200px] text-sm text-slate-300"
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
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="skeleton h-60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : resources.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, idx) => (
            <motion.div
              key={resource._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-6 border border-dark-700 flex flex-col justify-between h-full"
            >
              <div>
                <span className="badge badge-primary text-[10px] mb-3">{resource.category}</span>
                <h3 className="text-xl font-bold text-slate-100 mb-2">{resource.title}</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{resource.description}</p>
              </div>

              <div className="border-t border-dark-800/80 pt-4 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <FileText className="w-4 h-4" />
                  <span>{resource.fileType} ({resource.fileSize})</span>
                </div>
                <button
                  onClick={() => handleDownload(resource._id, resource.title)}
                  disabled={downloading === resource._id}
                  className="btn-primary btn-sm flex items-center gap-1.5"
                >
                  {downloading === resource._id ? (
                    'Opening...'
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Download ({resource.downloads})
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-dark-900/30 rounded-2xl border border-dark-700 max-w-lg mx-auto">
          <p className="text-xl text-gray-400 mb-4">No resources found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setCategory('')
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

export default Resources
