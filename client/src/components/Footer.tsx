import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin, Youtube, Mail, ArrowRight, Loader2, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import BrandLogo from './Logo';



export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Subscription failed. You may already be subscribed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-100/80 dark:bg-dark-950 border-t border-slate-200 dark:border-dark-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <BrandLogo size="lg" />
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Learn. Build. Decode. Your ultimate destination to master MERN full-stack development, roadmaps, and systems with practical real-world projects.
            </p>
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => window.open('https://github.com/mohitdjcet', '_blank', 'noopener,noreferrer')} 
                aria-label="GitHub"
                className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-dark-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
              >
                <Github className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => window.open('https://twitter.com/mohitdecodes', '_blank', 'noopener,noreferrer')} 
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-dark-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-400 hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => window.open('https://www.linkedin.com/in/mohitdecodes/', '_blank', 'noopener,noreferrer')} 
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-dark-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => window.open('https://www.instagram.com/mohitdecodes', '_blank', 'noopener,noreferrer')} 
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-dark-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-pink-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => window.open('https://youtube.com/@mohitdecodes', '_blank', 'noopener,noreferrer')} 
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-dark-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
              >
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Links Col 1: Learn */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-6">Learn</h3>
            <ul className="space-y-3">
              {['Courses', 'Tutorials', 'Roadmaps', 'Resources', 'Projects', 'Blogs'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm flex items-center group">
                    <span className="w-0 h-0.5 bg-purple-500 mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2: Company */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'YouTube', path: '/youtube' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm flex items-center group">
                    <span className="w-0 h-0.5 bg-purple-500 mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-6">Stay Ahead</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Get hand-picked articles, roadmap updates, and course releases delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="input pr-10 text-sm bg-white dark:bg-dark-900"
                />
                <Mail className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Subscribe Free <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-dark-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} MohitDecodes. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
