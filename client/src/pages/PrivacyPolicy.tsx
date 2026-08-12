import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Eye, Lock, FileText } from 'lucide-react'
import useTitle from '../hooks/useTitle'

const PrivacyPolicy: React.FC = () => {
  useTitle('Privacy Policy')

  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us when creating an account, registering for courses, subscribing to our newsletter, or submitting contact forms. This includes your name, email address, password, and transaction details for payments.'
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: 'We use your information to manage your account, track course progress, process payments via Razorpay, deliver newsletters, respond to support inquiries, and analyze platform usage to improve our developer education experience.'
    },
    {
      icon: ShieldCheck,
      title: 'Data Security & Storage',
      content: 'We prioritize the security of your personal data. We utilize industry-standard practices, including password hashing (bcrypt), TLS encryption for APIs, and secure third-party payment processing. Your password is never stored in plain text.'
    },
    {
      icon: FileText,
      title: 'Your Rights & Choices',
      content: 'You have the right to access, correct, or delete your account information at any time. You can opt-out of newsletter communications by using the unsubscribe link or contacting our support team.'
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
          <span className="badge badge-primary mb-3">Legal & Compliance</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Last updated: August 12, 2026. Learn how MohitDecodes collects, protects, and uses your personal data.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-8"
        >
          {sections.map((section, index) => (
            <div key={index} className="glass-card p-8 border border-dark-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center">
                  <section.icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-200">{section.title}</h2>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm">{section.content}</p>
            </div>
          ))}

          <div className="text-center text-xs text-slate-500 mt-12 leading-relaxed">
            By using MohitDecodes, you agree to the collection and use of information in accordance with this policy. For any questions, please contact hello@mohitdecodes.com.
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
