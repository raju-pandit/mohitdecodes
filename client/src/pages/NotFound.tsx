import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container-max relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h1 className="text-[150px] md:text-[200px] font-extrabold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-gray-700 to-gray-900 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-widest animate-pulse mix-blend-overlay">
              Lost
            </h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto space-y-8"
        >
          <div>
            <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
            <p className="text-gray-400 text-lg">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary py-3 px-8 rounded-full flex items-center justify-center gap-2">
              <ArrowLeft size={18} /> Back to Home
            </Link>
            <Link to="/courses" className="btn-outline py-3 px-8 rounded-full flex items-center justify-center">
              Explore Courses
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
