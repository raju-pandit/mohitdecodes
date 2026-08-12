import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Code2, 
  Users, 
  Briefcase, 
  Award, 
  Download,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { getCourses } from '../services/courseService'
import { getRoadmaps } from '../services/roadmapService'
import { getBlogs } from '../services/blogService'
import { Course, Roadmap, Blog, Testimonial } from '../types'
import { CourseCard } from '../components/CourseCard'
import { RoadmapCard } from '../components/RoadmapCard'
import { BlogCard } from '../components/BlogCard'
import { CourseCardSkeleton } from '../components/ui/SkeletonLoader'
import { TestimonialCard } from '../components/TestimonialCard'
import { useTitle } from '../hooks/useTitle'

const Home: React.FC = () => {
  useTitle('Learn. Build. Decode.', 'Practical programming courses, roadmaps, and projects to master MERN full-stack development.')
  const [courses, setCourses] = useState<Course[]>([])
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 15420,
    totalCourses: 8,
    totalResources: 8,
    totalDownloads: 12450
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, roadmapRes, blogRes, testimonialRes, statsRes] = await Promise.all([
          getCourses({ limit: 3 }),
          getRoadmaps(),
          getBlogs({ limit: 3 }),
          api.get('/testimonials'),
          api.get('/admin/stats').catch(() => null) // Fallback if user is not admin
        ])
        
        setCourses(courseRes.data || [])
        setRoadmaps(roadmapRes.data?.slice(0, 3) || [])
        setBlogs(blogRes.data || [])
        
        // Find approved testimonials
        const testimonialsData = testimonialRes.data?.data || testimonialRes.data || []
        setTestimonials(testimonialsData.slice(0, 6))

        if (statsRes && statsRes.data) {
          setStats(statsRes.data)
        }
      } catch (err) {
        console.error('Error fetching home page data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    try {
      await api.post('/newsletter/subscribe', { email })
      toast.success('Successfully subscribed to the newsletter!')
      setEmail('')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Subscription failed')
    } finally {
      setSubmitting(false)
    }
  }

  const codeSnippet = `const mohitDecodes = {
  mission: "Empower developers",
  features: ["Courses", "Roadmaps", "Projects"],
  isAwesome: true,
  startLearning: () => {
    console.log("Let's build!");
  }
};`

  return (
    <div className="overflow-hidden bg-grid">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-700/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />
        </div>
        
        <div className="container-max grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-500/30 bg-primary-950/40 text-primary-400 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Premium Full-Stack Learning</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Decode. Build. <br />
              <span className="gradient-text">Become a Better Developer.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Practical tutorials, courses, roadmaps, projects and resources designed to take your coding skills to the next level.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/courses" className="btn-primary py-3 px-6 text-base sm:py-4 sm:px-8 sm:text-lg font-semibold rounded-full flex items-center gap-2 group">
                Explore Courses
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link to="/register" className="btn-outline py-3 px-6 text-base sm:py-4 sm:px-8 sm:text-lg font-semibold rounded-full">
                Start Learning Free
              </Link>
            </div>
            
            <div className="pt-8 border-t border-dark-800 flex justify-center lg:justify-start gap-8">
              <div>
                <p className="text-3xl font-bold text-white">{(stats.totalUsers || 15420).toLocaleString()}+</p>
                <p className="text-gray-500 text-sm">Learners</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.totalCourses || 8}+</p>
                <p className="text-gray-500 text-sm">Courses</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.totalResources || 8}+</p>
                <p className="text-gray-500 text-sm">Resources</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-full overflow-hidden"
          >
            <div className="glass-card p-6 rounded-2xl border border-dark-700 shadow-2xl relative z-10 w-full overflow-hidden">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <pre className="text-xs md:text-sm font-mono text-cyan-400 overflow-x-auto w-full max-w-full">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="py-20 bg-dark-900/40 border-y border-dark-800">
        <div className="container-max">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4">
            <div className="text-center md:text-left">
              <h2 className="section-title mb-2">Featured <span className="gradient-text">Courses</span></h2>
              <p className="section-subtitle">Top rated courses to level up your skills.</p>
            </div>
            <Link to="/courses" className="btn-outline btn-sm flex items-center gap-1">
              View All Courses <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(3).fill(0).map((_, i) => <CourseCardSkeleton key={i} />)
            ) : (
              courses.map((course) => (
                <motion.div 
                  key={course._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ROADMAPS PREVIEW */}
      <section className="py-20">
        <div className="container-max">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4">
            <div className="text-center md:text-left">
              <h2 className="section-title mb-2">Learning <span className="gradient-text">Roadmaps</span></h2>
              <p className="section-subtitle">Step-by-step guidance on what to learn next.</p>
            </div>
            <Link to="/roadmaps" className="btn-outline btn-sm flex items-center gap-1">
              View All Roadmaps <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)
            ) : (
              roadmaps.map((roadmap) => (
                <motion.div 
                  key={roadmap._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <RoadmapCard roadmap={roadmap} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-dark-900/20 border-t border-dark-800">
        <div className="container-max text-center">
          <h2 className="section-title mb-4">Why <span className="gradient-text">MohitDecodes?</span></h2>
          <p className="section-subtitle mb-16 mx-auto">Everything you need to grow your career as a developer.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              { icon: BookOpen, title: 'Practical Learning', desc: 'Focus on real-world skills, not just theory.' },
              { icon: Code2, title: 'Real Projects', desc: 'Build portfolio-ready projects while learning.' },
              { icon: Users, title: 'Beginner Friendly', desc: 'Complex topics broken down into simple terms.' },
              { icon: Briefcase, title: 'Career Prep', desc: 'Guidance to help you land your dream job.' },
              { icon: Award, title: 'Interview Prep', desc: 'Master coding interviews and system design.' },
              { icon: Download, title: 'Free Resources', desc: 'Cheat sheets, notes, and roadmaps to guide you.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-8 rounded-2xl"
              >
                <div className="w-14 h-14 bg-primary-700/10 text-primary-400 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-dark-900/40 border-t border-dark-800">
          <div className="container-max text-center">
            <h2 className="section-title mb-4">Loved by <span className="gradient-text">Learners</span></h2>
            <p className="section-subtitle mb-16 mx-auto">Here is what our students have to say about their learning experience.</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LATEST BLOGS */}
      {blogs.length > 0 && (
        <section className="py-20 border-t border-dark-800">
          <div className="container-max">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4">
              <div className="text-center md:text-left">
                <h2 className="section-title mb-2">Latest from the <span className="gradient-text">Blog</span></h2>
                <p className="section-subtitle">Insightful articles on web dev trends and career tips.</p>
              </div>
              <Link to="/blogs" className="btn-outline btn-sm flex items-center gap-1">
                View All Articles <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <motion.div 
                  key={blog._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="py-24 relative border-t border-dark-800">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/20 to-cyan-950/20" />
        <div className="container-max relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Join 100,000+ Developers</h2>
          <p className="text-xl text-slate-300 mb-10">Get weekly tips, free resources, and the latest tutorials delivered straight to your inbox.</p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="input flex-1 py-4 text-lg rounded-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={submitting}
              className="btn-primary py-4 px-8 rounded-full text-lg font-semibold whitespace-nowrap"
            >
              {submitting ? 'Subscribing...' : 'Subscribe Now'}
            </button>
          </form>
          <p className="text-gray-500 text-sm mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  )
}

export default Home
