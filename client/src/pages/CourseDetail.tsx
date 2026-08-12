import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ChevronDown, ChevronUp, Clock, Users, Star, PlayCircle,
  Lock, CheckCircle, BookOpen, Share2, ArrowLeft, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Course } from '../types'
import { useTitle } from '../hooks/useTitle'
import BugReportFloating from '../components/BugReportFloating'

const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  useTitle(course?.title || 'Loading Course...', course?.shortDescription || course?.description || '')
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [openModule, setOpenModule] = useState<number | null>(0)
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  const isEnrolled = user?.enrolledCourses?.some((ec: any) => {
    const cid = ec.courseId?._id || ec.courseId || ec
    return cid === course?._id
  })

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get('/courses/' + slug)
        setCourse(res.data.data || res.data)
      } catch {
        toast.error('Course not found')
        navigate('/courses')
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchCourse()
  }, [slug, navigate])

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    
    if (!course) return;

    setEnrolling(true)
    
    // Free course enrollment
    if (course.isFree || course.price <= 0) {
      try {
        await api.post('/courses/' + course._id + '/enroll')
        toast.success('Successfully enrolled!')
        
        // Update local user state
        const meRes = await api.get('/auth/me')
        if (meRes.data?.data?.user) {
          updateUser(meRes.data.data.user)
        } else if (meRes.data?.user) {
          updateUser(meRes.data.user)
        }
        navigate('/dashboard')
      } catch (err: any) {
        toast.error(err?.response?.data?.message || err?.message || 'Enrollment failed')
      } finally {
        setEnrolling(false)
      }
      return;
    }

    // Paid course Razorpay checkout enrollment
    try {
      // 1. Create order on the backend
      const orderRes = await api.post('/payments/order', { courseId: course._id });
      const orderData = orderRes.data || orderRes;

      if (!orderData || !orderData.orderId) {
        throw new Error('Failed to initiate payment order');
      }

      // 2. Setup Razorpay Checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TOZGrdGwMgy14N',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MohitDecodes',
        description: `Enroll in ${course.title}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            setEnrolling(true);
            // 3. Verify signature on the backend
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id
            });
            
            toast.success('Payment verified! Enrolled successfully.');
            
            // Sync local user context
            const meRes = await api.get('/auth/me')
            if (meRes.data?.data?.user) {
              updateUser(meRes.data.data.user)
            } else if (meRes.data?.user) {
              updateUser(meRes.data.user)
            }
            navigate('/dashboard');
          } catch (verifyErr: any) {
            toast.error(verifyErr?.message || 'Payment verification failed');
          } finally {
            setEnrolling(false);
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        theme: {
          color: '#7c3aed'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Payment initiation failed. Please try again.');
    } finally {
      setEnrolling(false)
    }
  }

  const handleLessonToggle = async (moduleIndex: number, lessonIndex: number) => {
    if (!user) {
      toast.error('Please log in to track your progress')
      return
    }
    try {
      const res = await api.put('/courses/lessons/toggle-complete', {
        courseId: course?._id,
        moduleIndex,
        lessonIndex
      })
      
      // Update local user context
      const userData = res.data?.data?.user || res.data?.user
      if (userData) {
        updateUser(userData)
      } else {
        const meRes = await api.get('/auth/me')
        if (meRes.data?.data?.user) {
          updateUser(meRes.data.data.user)
        }
      }
      toast.success('Progress updated!')
    } catch {
      toast.error('Failed to update progress')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="spinner w-12 h-12" />
      </div>
    )
  }

  if (!course) return null

  const totalLessons = course.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0
  const diffColor = course.difficulty === 'Beginner' ? 'badge-green' : course.difficulty === 'Intermediate' ? 'badge-orange' : 'badge-red'

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero */}
      <div className="bg-gradient-to-b from-dark-900 to-dark-950 py-12 px-4">
        <div className="container-max">
          <Link to="/courses" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="badge-primary badge">{course.category}</span>
                <span className={diffColor + ' badge'}>{course.difficulty}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">{course.title}</h1>
              <p className="text-slate-400 text-lg mb-6">{course.shortDescription || course.description}</p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span className="font-semibold">{typeof course.rating === 'number' ? course.rating : (course.rating?.average || 4.8).toFixed(1)}</span>
                  <span className="text-slate-400">({typeof course.rating === 'number' ? 45 : (course.rating?.count || 12)} ratings)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Users className="w-4 h-4" />
                  {course.students?.toLocaleString()} students
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <BookOpen className="w-4 h-4" />
                  {totalLessons} lessons
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-6">
                <img src={course.instructor?.avatar || 'https://ui-avatars.com/api/?name=Mohit'} alt={course.instructor?.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-sm text-slate-400">Instructor</p>
                  <p className="font-medium text-slate-200">{course.instructor?.name || 'Mohit'}</p>
                </div>
              </div>

              {/* Tags */}
              {course.tags && (
                <div className="flex flex-wrap gap-2">
                  {course.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Right sticky card */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="glass-card p-6 border border-dark-600 bg-dark-900/40">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.title} className="w-full rounded-xl mb-6 object-cover h-48" />
                )}

                <div className="mb-6">
                  {course.isFree ? (
                    <span className="text-3xl font-bold text-green-400">FREE</span>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-slate-100">₹{course.price}</span>
                    </div>
                  )}
                </div>

                {isEnrolled ? (
                  <Link to="/dashboard" className="btn-primary w-full flex items-center justify-center gap-2 text-center">
                    <CheckCircle className="w-5 h-5" /> Continue Learning
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {enrolling
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Enrolling...</>
                      : course.isFree ? 'Enroll for Free' : 'Enroll Now'
                    }
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="btn-ghost w-full mt-3 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-200"
                >
                  <Share2 className="w-4 h-4" /> Share Course
                </button>

                <div className="mt-6 space-y-3 text-sm text-slate-400">
                  <p className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {course.modules?.length || 0} modules</p>
                  <p className="flex items-center gap-2"><PlayCircle className="w-4 h-4" /> {totalLessons} video lessons</p>
                  <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> {course.duration} total duration</p>
                  <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Certificate on completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="container-max py-12">
        <h2 className="text-2xl font-bold text-slate-100 mb-8">Course Curriculum</h2>

        {course.modules?.length ? (
          <div className="space-y-3">
            {course.modules.map((module: any, mi: number) => (
              <div key={mi} className="glass-card border border-dark-700 overflow-hidden bg-dark-900/30">
                <button
                  onClick={() => setOpenModule(openModule === mi ? null : mi)}
                  className="w-full flex items-center justify-between p-5 hover:bg-dark-700/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-primary-400 font-semibold text-sm">{String(mi + 1).padStart(2, '0')}</span>
                    <span className="font-semibold text-slate-200">{module.title}</span>
                    <span className="text-xs text-slate-500">{module.lessons?.length || 0} lessons</span>
                  </div>
                  {openModule === mi
                    ? <ChevronUp className="w-5 h-5 text-slate-400" />
                    : <ChevronDown className="w-5 h-5 text-slate-400" />
                  }
                </button>

                {openModule === mi && module.lessons && (
                  <div className="border-t border-dark-700">
                    {module.lessons.map((lesson: any, li: number) => {
                      const lessonKey = `${course._id}-${mi}-${li}`
                      const isLessonCompleted = user?.completedLessons?.includes(lessonKey)

                      return (
                        <div key={li} className="flex items-center justify-between px-5 py-3 hover:bg-dark-800/30 transition-colors border-b border-dark-800/50 last:border-0">
                          <div className="flex items-center gap-3">
                            {isEnrolled ? (
                              <button
                                onClick={() => handleLessonToggle(mi, li)}
                                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                  isLessonCompleted
                                    ? 'bg-green-500/20 border-green-500 text-green-400'
                                    : 'border-dark-600 hover:border-slate-400 text-transparent'
                                }`}
                              >
                                ✓
                              </button>
                            ) : lesson.isFree ? (
                              <PlayCircle className="w-4 h-4 text-primary-400" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-500" />
                            )}
                            <span className="text-sm text-slate-300">{lesson.title}</span>
                            {lesson.isFree && !isEnrolled && (
                              <span className="badge badge-green text-xs">Free Preview</span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">{lesson.duration}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center bg-dark-900/30">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Curriculum coming soon</p>
          </div>
        )}
      </div>
      <BugReportFloating />
    </div>
  )
}

export default CourseDetail
