import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Key, Loader2, ArrowLeft, Code2, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import BrandLogo from '../components/Logo'


const ForgotPassword: React.FC = () => {
  const { token } = useParams()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('Reset link sent! Check your email.')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post(`/auth/reset-password/${token}`, { password: newPassword })
      toast.success('Password reset successfully! You can now log in.')
      setSent(true)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <BrandLogo size="lg" />
          </div>

          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            {token ? 'Reset Password' : 'Forgot Password'}
          </h1>
          <p className="text-slate-400">
            {token ? 'Enter your new password below' : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        <div className="glass-card p-8 border border-dark-700">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-100">
                {token ? 'Password Reset!' : 'Email Sent!'}
              </h2>
              <p className="text-slate-400 text-sm">
                {token ? 'Your password has been reset successfully.' : 'Check your email for the reset link.'}
              </p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          ) : token ? (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="input"
                  required
                  minLength={6}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Resetting...</> : <><Key className="w-5 h-5" /> Reset Password</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : <><Mail className="w-5 h-5" /> Send Reset Link</>}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="text-slate-400 hover:text-slate-200 text-sm flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
