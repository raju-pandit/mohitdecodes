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
    <footer className="bg-dark-950 border-t border-dark-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <BrandLogo size="lg" />
            </div>

            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Learn. Build. Decode. Your ultimate destination to master MERN full-stack development, roadmaps, and systems with practical real-world projects.
            </p>
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => window.open('https://github.com/mohitdjcet', '_blank', 'noopener,noreferrer')} 
                aria-label="GitHub"
                className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-slate-400 hover:bg-primary-500 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <Github className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => window.open('https://twitter.com/mohitdecodes', '_blank', 'noopener,noreferrer')} 
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-slate-400 hover:bg-blue-400 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => window.open('https://www.linkedin.com/in/mohitdecodes/', '_blank', 'noopener,noreferrer')} 
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => window.open('https://www.instagram.com/mohitdecodes', '_blank', 'noopener,noreferrer')} 
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => window.open('https://youtube.com/@mohitdecodes', '_blank', 'noopener,noreferrer')} 
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Links Col 1: Learn */}
          <div>
            <h3 className="text-white font-semibold mb-6">Learn</h3>
            <ul className="space-y-3">
              {['Courses', 'Tutorials', 'Roadmaps', 'Resources', 'Projects', 'Blogs'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-slate-400 hover:text-primary-400 transition-colors text-sm flex items-center group">
                    <span className="w-0 h-0.5 bg-primary-400 mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2: Company */}
          <div>
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'YouTube', path: '/youtube' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-400 hover:text-primary-400 transition-colors text-sm flex items-center group">
                    <span className="w-0 h-0.5 bg-primary-400 mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h3 className="text-white font-semibold mb-6">Stay Updated</h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe to our newsletter for the latest tutorials, courses, and tech updates.
            </p>
            <form className="space-y-2" onSubmit={handleSubscribe}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-2.5 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} MohitDecodes. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> for developers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
