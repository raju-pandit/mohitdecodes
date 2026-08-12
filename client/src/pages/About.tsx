import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Target, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-dark-950 pointer-events-none" />
        <div className="container-max relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">Our <span className="gradient-text">Mission</span></h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We believe that high-quality coding education should be accessible, practical, and engaging. MohitDecodes was built to bridge the gap between theory and real-world development.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-dark-700 bg-dark-900/30">
        <div className="container-max flex justify-around flex-wrap gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-white mb-2">100K+</div>
            <div className="text-gray-400 font-medium">Students Worldwide</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-2">50+</div>
            <div className="text-gray-400 font-medium">Premium Courses</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-2">4.9/5</div>
            <div className="text-gray-400 font-medium">Average Rating</div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Core Values</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { icon: Code2, title: 'Learn by Doing', desc: 'Practical, project-based curriculum.' },
            { icon: Target, title: 'Career Focused', desc: 'Skills that employers actually want.' },
            { icon: Zap, title: 'Up to Date', desc: 'Modern tech stacks and best practices.' },
            { icon: Heart, title: 'Community Driven', desc: 'Supportive environment for everyone.' }
          ].map((val, i) => (
            <div key={i} className="glass-card p-8 rounded-2xl border border-dark-700">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <val.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">{val.title}</h3>
              <p className="text-gray-400">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center container-max">
        <div className="glass-card p-12 rounded-3xl border border-blue-500/30 bg-blue-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to start your journey?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto relative z-10">
            Join thousands of developers who are advancing their careers with MohitDecodes.
          </p>
          <Link to="/courses" className="btn-primary py-4 px-10 text-lg font-bold rounded-full relative z-10 inline-block">
            Explore Courses
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
