import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, Bookmark, Share2, Heart, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getBlog, addComment, toggleSaveBlog } from '../services/blogService'
import { Blog } from '../types'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/formatters'
import { useTitle } from '../hooks/useTitle'

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [blog, setBlog] = useState<Blog | null>(null)
  useTitle(blog?.title || 'Loading Blog...', blog?.excerpt || '')
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [commenting, setCommenting] = useState(false)
  const { user, updateUser } = useAuth()

  const isSaved = user?.savedBlogs?.some((b: any) =>
    b === blog?._id || b._id === blog?._id
  )

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlog(slug!)
        setBlog(res.data)
      } catch (err) {
        console.error('Error loading blog details:', err)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchBlog()
  }, [slug])

  const handleSaveToggle = async () => {
    if (!user) {
      toast.error('Please log in to save articles')
      return
    }
    try {
      const res = await toggleSaveBlog(blog?._id!)
      // Update saved blogs array on local user state
      updateUser({ ...user, savedBlogs: res.data as any })
      toast.success(isSaved ? 'Removed from saved articles' : 'Saved to library!')
    } catch {
      toast.error('Failed to update saved articles')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setCommenting(true)
    try {
      const res = await addComment(blog?._id!, { text: commentText })
      setBlog(res.data)
      setCommentText('')
      toast.success('Comment added successfully!')
    } catch {
      toast.error('Failed to add comment')
    } finally {
      setCommenting(false)
    }
  }

  if (loading) {
    return (
      <div className="container-max py-20 flex justify-center">
        <div className="spinner w-12 h-12" />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container-max py-20 text-center text-slate-400">
        Article not found
      </div>
    )
  }

  const blogDate = blog.createdAt || new Date().toISOString()

  return (
    <div className="pb-20">
      <div className="container-max py-12 max-w-4xl">
        <Link to="/blogs" className="text-primary-400 hover:text-primary-300 mb-8 inline-block">
          &larr; Back to Blogs
        </Link>
        
        <div className="flex gap-2 mb-6">
          <span className="badge badge-primary">{blog.category}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-slate-100">
          {blog.title}
        </h1>
        
        <div className="flex items-center justify-between py-6 border-y border-dark-700 mb-8">
          <div className="flex items-center gap-4">
            <img src={blog.author?.avatar} alt={blog.author?.name} className="w-12 h-12 rounded-full border border-dark-700" />
            <div>
              <p className="font-bold text-slate-200">{blog.author?.name}</p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(blogDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {blog.readingTime || 5} min read
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSaveToggle}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                isSaved 
                  ? 'bg-primary-700/20 border-primary-700 text-primary-400' 
                  : 'border-dark-700 text-gray-400 hover:bg-dark-800'
              }`}
            >
              <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full border border-dark-700 text-gray-400 flex items-center justify-center hover:bg-dark-800 transition-colors"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {blog.coverImage && (
          <img src={blog.coverImage} alt={blog.title} className="w-full h-auto rounded-2xl mb-12 border border-dark-800" />
        )}

        <div className="prose-dark max-w-none prose lg:prose-xl mb-12">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
        </div>

        {/* Comments Section */}
        <div className="border-t border-dark-700 pt-12 mt-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary-400" /> Comments ({(blog as any).comments?.length || 0})
          </h2>

          {/* Form */}
          <form onSubmit={handleCommentSubmit} className="mb-10 space-y-4">
            <textarea
              className="input resize-none bg-dark-900"
              rows={4}
              placeholder={user ? "Write a comment..." : "Log in to post a comment"}
              disabled={!user || commenting}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              required
            />
            {user ? (
              <button
                type="submit"
                disabled={commenting || !commentText.trim()}
                className="btn-primary"
              >
                {commenting ? 'Posting...' : 'Post Comment'}
              </button>
            ) : (
              <Link to="/login" className="btn-secondary inline-block">
                Log In to Comment
              </Link>
            )}
          </form>

          {/* Comments List */}
          {(blog as any).comments && (blog as any).comments.length > 0 ? (
            <div className="space-y-6">
              {(blog as any).comments.map((comment: any, idx: number) => (
                <div key={idx} className="glass-card p-5 border border-dark-700 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-700/10 border border-primary-700/20 flex items-center justify-center shrink-0 font-bold text-primary-400">
                    {comment.name[0]?.toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-200">{comment.name}</h4>
                      <span className="text-xs text-slate-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{comment.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm text-center py-6">No comments yet. Be the first to start the conversation!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
