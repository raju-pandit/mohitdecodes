import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, UserPlus, Code2, Loader2, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { GoogleSignInButton } from '../components/GoogleSignInButton'
import BrandLogo from '../components/Logo'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { register: registerUser, user } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const password = watch('password', '')

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = err?.error || err?.message || err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    }
  };


  const passwordChecks = [
    { label: 'At least 6 characters', valid: password.length >= 6 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
  ]

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-cyan-700/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <BrandLogo size="lg" />
          </div>

          <h1 className="text-3xl font-bold text-slate-100 mb-2">Create your account 🚀</h1>
          <p className="text-slate-400">Join thousands of developers learning with MohitDecodes</p>
        </div>

        <div className="glass-card p-8 border border-dark-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input
                {...register('name')}
                type="text"
                placeholder="Mohit Sharma"
                className="input"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="input"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className="input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <Check className={check.valid ? 'w-3 h-3 text-green-400' : 'w-3 h-3 text-slate-600'} />
                      <span className={check.valid ? 'text-green-400' : 'text-slate-500'}>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Confirm your password"
                className="input"
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isSubmitting
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</>
                : <><UserPlus className="w-5 h-5" /> Create Account</>
              }
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-dark-900 text-slate-500 font-semibold uppercase tracking-wider">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            <GoogleSignInButton />
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center">
            By creating an account, you agree to our{' '}
            <Link to="/about" className="text-primary-400 hover:text-primary-300">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/about" className="text-primary-400 hover:text-primary-300">Privacy Policy</Link>
          </p>
        </div>

        <p className="text-center text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Log in</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Register
