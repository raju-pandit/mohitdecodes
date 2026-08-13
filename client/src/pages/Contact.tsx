import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Mail, MessageSquare, Send, Github, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../services/api'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormInputs = z.infer<typeof contactSchema>

const Contact: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormInputs) => {
    try {
      await api.post('/contact', data)
      toast.success('Message sent! We will get back to you soon.')
      reset()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send message. Try again.')
    }
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@mohitdecodes.com', href: 'mailto:hello@mohitdecodes.com' },
    { icon: Youtube, label: 'YouTube', value: '@MohitDecodes', href: 'https://youtube.com/@mohitdecodes' },
    { icon: Github, label: 'GitHub', value: 'mohitdjcet', href: 'https://github.com/mohitdjcet' },
    { icon: Twitter, label: 'Twitter', value: '@mohitdecodes', href: 'https://twitter.com/mohitdecodes' },
    { icon: Linkedin, label: 'LinkedIn', value: 'mohitdecodes', href: 'https://www.linkedin.com/in/mohitdecodes/' },
    { icon: Instagram, label: 'Instagram', value: 'mohitdecodes', href: 'https://www.instagram.com/mohitdecodes' },
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-dark-900 to-dark-950">
        <div className="container-max text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="section-title mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Have a question, feedback, or want to collaborate? I'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">Let's connect</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Feel free to reach out through any of these platforms. I try to respond within 24-48 hours.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => window.open(item.href, '_blank', 'noopener,noreferrer')}
                      className="glass-card-hover w-full flex items-center gap-4 p-4 text-left cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-primary-700/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{item.label}</p>
                        <p className="text-slate-200 font-medium text-sm">{item.value}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="glass-card p-5 border border-primary-700/20">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-primary-400" />
                  <h3 className="font-semibold text-slate-200">Response Time</h3>
                </div>
                <p className="text-slate-400 text-sm">Usually within 24-48 hours on weekdays. For urgent matters, DM on Twitter.</p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="glass-card p-8 border border-dark-700">
                <h2 className="text-xl font-bold text-slate-100 mb-6">Send a message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="John Doe"
                        {...register('name')}
                      />
                      {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        className="input"
                        placeholder="john@example.com"
                        {...register('email')}
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="What's this about?"
                      {...register('subject')}
                    />
                    {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                    <textarea
                      className="input resize-none"
                      placeholder="Tell me more..."
                      rows={6}
                      {...register('message')}
                    />
                    {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isSubmitting ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
