import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Code2, 
  Users, 
  Briefcase, 
  Award, 
  Download,
  ArrowRight,
  Sparkles,
  Linkedin,
  Youtube,
  Instagram
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

const words = ["Future!", "MohitDecodes", "Family!"];

const AnimatedWord: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentWord = words[index];
  const characters = Array.from(currentWord);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 15,
      transition: { type: "spring", damping: 12, stiffness: 200 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 200 }
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: { ease: "easeIn", duration: 0.15 }
    }
  };

  return (
    <span className="gradient-text drop-shadow-[0_0_15px_rgba(124,58,237,0.4)] inline-block">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="inline-block"
        >
          {characters.map((char, charIdx) => (
            <motion.span
              key={charIdx}
              variants={letterVariants}
              className="inline-block"
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

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
    <div className="overflow-hidden bg-grid particles-bg">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-700/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-600/10 rounded-full blur-[150px]" />
        </div>
        
        <div className="container-max grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              Be a part of our <br />
              <AnimatedWord />
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              A community of coders, making the world a better place. Learn, build, and grow with the best developers in the industry.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 justify-center lg:justify-start">
              <a href="https://www.linkedin.com/in/mohitdecodes/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/20 hover:text-white flex items-center justify-center transition-all duration-300">
                <Linkedin size={20} />
              </a>
              <a href="https://youtube.com/@mohitdecodes" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/20 hover:text-white flex items-center justify-center transition-all duration-300">
                <Youtube size={20} />
              </a>
              <a href="https://www.instagram.com/mohitdecodes" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-pink-500/30 text-pink-500 bg-pink-500/5 hover:bg-pink-500/20 hover:text-white flex items-center justify-center transition-all duration-300">
                <Instagram size={20} />
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/courses" className="btn-primary py-3 px-6 sm:py-3.5 sm:px-8 font-semibold rounded-xl flex items-center gap-2 group shadow-glow-purple">
                Start Paid Learning
              </Link>
              <a href="https://youtube.com/@mohitdecodes" target="_blank" rel="noreferrer" className="btn-secondary py-3 px-6 sm:py-3.5 sm:px-8 font-semibold rounded-xl flex items-center gap-2 border border-dark-700 bg-dark-900/60 hover:bg-dark-800 transition-all">
                <Youtube className="text-red-500 fill-red-500" size={20} />
                Watch on YouTube
              </a>
            </div>
            
            {/* Stats Row */}
            <div className="pt-8 border-t border-dark-800 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
                <Award className="w-6 h-6 text-primary-400 mb-2" />
                <p className="text-2xl font-extrabold text-white">202K+</p>
                <p className="text-gray-500 text-xs font-semibold">Students</p>
              </div>
              <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
                <BookOpen className="w-6 h-6 text-primary-400 mb-2" />
                <p className="text-2xl font-extrabold text-white">5+</p>
                <p className="text-gray-500 text-xs font-semibold">Courses</p>
              </div>
              <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
                <Users className="w-6 h-6 text-primary-400 mb-2" />
                <p className="text-2xl font-extrabold text-white">2+</p>
                <p className="text-gray-500 text-xs font-semibold">Instructors</p>
              </div>
            </div>
          </motion.div>

          {/* Right C++ Terminal visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-full overflow-hidden animate-float"
          >
            {/* Glowing borders around card */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur-[12px] opacity-40 pointer-events-none" />
            
            <div className="relative bg-[#08080f] rounded-2xl border border-dark-700/50 shadow-2xl relative z-10 w-full overflow-hidden font-mono">
              {/* Header bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d16] border-b border-dark-800">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-400 font-semibold select-none">CoderArmy.cpp</span>
                <span className="flex items-center gap-1.5 text-[10px] text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded-full select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live Coding
                </span>
              </div>
              
              {/* C++ IDE visual code editor style */}
              <div className="p-5 text-left text-xs sm:text-sm text-slate-300 space-y-1 overflow-x-auto leading-relaxed select-none">
                <div><span className="text-gray-600 mr-4 inline-block w-4">22</span><span className="text-slate-400">cout &lt;&lt; </span><span className="text-emerald-400">"[SYSTEM] \"CoderArmy"</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">23</span><span className="text-slate-400">initialized successfully.\"" &lt;&lt; endl;</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">24</span><span className="text-slate-400">{'}'}</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">25</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">26</span><span className="text-primary-400">void</span><span className="text-slate-300"> addMember(</span><span className="text-primary-400">const</span><span className="text-slate-300"> string& name) {'{'}</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">27</span><span className="text-slate-400">    members.push_back(name);</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">28</span><span className="text-slate-400">    cout &lt;&lt; </span><span className="text-emerald-400">"[NEW MEMBER] \""</span><span className="text-slate-400"> &lt;&lt; name</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">29</span><span className="text-slate-400">    &lt;&lt; </span><span className="text-emerald-400">" has joined the team.\""</span><span className="text-slate-400"> &lt;&lt; endl;</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">30</span><span className="text-slate-400">    cout &lt;&lt; </span><span className="text-emerald-400">"[INFO] \"Total members: \""</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">31</span><span className="text-slate-400">    &lt;&lt; members.size() &lt;&lt; </span><span className="text-emerald-400">"\""</span><span className="text-slate-400"> &lt;&lt; endl;</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">32</span><span className="text-slate-400">{'}'}</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">33</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">34</span><span className="text-primary-400">void</span><span className="text-slate-300"> startCoding() {'{'}</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">35</span><span className="text-primary-400">    if</span><span className="text-slate-300"> (!isActive) {'{'}</span></div>
                <div><span className="text-gray-600 mr-4 inline-block w-4">36</span><span className="text-slate-400">        cout &lt;&lt; </span><span className="text-emerald-400">"[WARNING] \"Army i...</span></div>
              </div>
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
            
            <div className="marquee-container py-4 relative">
              {/* Side fades */}
              <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#060a12] to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#060a12] to-transparent z-10 pointer-events-none" />

              <div className="marquee-content">
                {testimonials.map((testimonial, i) => (
                  <div key={`marquee-1-${testimonial._id}-${i}`} className="w-[320px] md:w-[380px] flex-shrink-0 text-left">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
              <div className="marquee-content" aria-hidden="true">
                {testimonials.map((testimonial, i) => (
                  <div key={`marquee-2-${testimonial._id}-${i}`} className="w-[320px] md:w-[380px] flex-shrink-0 text-left">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
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
