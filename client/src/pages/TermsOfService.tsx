import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, User, BookOpen, AlertCircle } from 'lucide-react'
import useTitle from '../hooks/useTitle'

const TermsOfService: React.FC = () => {
  useTitle('Terms & Conditions')

  const items = [
    {
      icon: User,
      title: 'User Accounts',
      desc: 'You are responsible for safeguarding the credentials used to access your MohitDecodes account. You agree not to disclose your password to any third party and must notify us immediately of any security breaches.'
    },
    {
      icon: BookOpen,
      title: 'Intellectual Property',
      desc: 'All course materials, video lectures, coding resources, and tutorials on MohitDecodes are the intellectual property of MohitDecodes. They are licensed for personal, educational, non-commercial use only.'
    },
    {
      icon: CheckCircle2,
      title: 'Payments & Refunds',
      desc: 'Course purchases are processed securely through Razorpay. Once a paid course is purchased and accessed, it qualifies for lifetime learning access. Standard refund queries can be routed to support.'
    },
    {
      icon: AlertCircle,
      title: 'Termination of Use',
      desc: 'We reserve the right to suspend or terminate accounts that violate our code of conduct, distribute copy-protected content, or engage in malicious behavior towards the platform or other learners.'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-950 py-20 px-4">
      <div className="container-max max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="badge badge-cyan mb-3">Legal & Compliance</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100">
            Terms & <span className="gradient-text">Conditions</span>
          </h1>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Last updated: August 12, 2026. Please read these terms carefully before accessing or using the platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {items.map((item, index) => (
            <div key={index} className="glass-card p-8 border border-dark-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-200">{item.title}</h2>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="text-center text-xs text-slate-500 mt-12 leading-relaxed max-w-xl mx-auto">
          Your access to and use of MohitDecodes is conditioned on your acceptance of and compliance with these Terms. If you disagree with any part of the terms, you may not access the platform.
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
