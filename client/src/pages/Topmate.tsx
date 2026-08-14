import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Users,
  Star,
  Clock,
  Video,
  FileCheck,
  Code2,
  Compass,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TopmateCard as TopmateCardType } from '../types';
import { getPublicTopmateCards, DEFAULT_TOPMATE_URL } from '../services/topmateService';
import TopmateCard from '../components/TopmateCard';
import { useTitle } from '../hooks/useTitle';

const servicesList = [
  {
    icon: Video,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    title: '1:1 Mentorship & Doubt Solving',
    duration: '30 - 45 Mins',
    desc: 'Ask anything about Web Development, JavaScript, React, Node.js, MERN stack, career switches, and roadmap strategy.',
    badge: 'Popular',
    url: DEFAULT_TOPMATE_URL
  },
  {
    icon: FileCheck,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    title: 'Resume & Portfolio Audit',
    duration: '30 Mins',
    desc: 'Line-by-line review of your developer resume, GitHub profile, LinkedIn branding, and live project deployments to get shortlisted.',
    badge: 'High Impact',
    url: DEFAULT_TOPMATE_URL
  },
  {
    icon: Code2,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    title: 'Mock Technical Interview',
    duration: '60 Mins',
    desc: 'Realistic full-stack live coding, JavaScript fundamentals, system architecture questions, and immediate actionable feedback.',
    badge: 'Interview Prep',
    url: DEFAULT_TOPMATE_URL
  },
  {
    icon: Compass,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    title: 'Personalized Career Roadmap',
    duration: '45 Mins',
    desc: 'Customized week-by-week study and project blueprint tailored to your background, target companies, and current skillset.',
    badge: 'Career Blueprint',
    url: DEFAULT_TOPMATE_URL
  }
];

const faqs = [
  {
    q: 'How do 1:1 mentorship sessions work?',
    a: 'Once you select a topic and pick a convenient date & time on Topmate, you will receive an instant calendar invite with a Google Meet / Zoom link. We will connect 1:1 live on video to discuss your questions.'
  },
  {
    q: 'What should I prepare before our call?',
    a: 'Bring your specific questions, resume PDF link, GitHub profile, and any project URLs you want us to review. Having a clear list of goals helps us maximize your session time.'
  },
  {
    q: 'Can I reschedule my session if something comes up?',
    a: 'Yes, absolutely! You can reschedule your session up to 4 hours before the scheduled time directly from your Topmate booking confirmation email.'
  },
  {
    q: 'Are these sessions suitable for beginners?',
    a: 'Yes! Whether you are just starting to learn programming or preparing for Senior Full-Stack roles, the sessions are completely personalized to your experience level.'
  }
];

export const Topmate: React.FC = () => {
  useTitle('1:1 Mentorship & Guidance | Topmate');
  const [cards, setCards] = useState<TopmateCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await getPublicTopmateCards();
        setCards(data);
      } catch (err) {
        console.error('Failed to load Topmate cards:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const handleOpenTopmate = (url?: string) => {
    window.open(url || DEFAULT_TOPMATE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white transition-colors duration-300 pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-16">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-max text-center relative z-10 space-y-6 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-amber-500/10 border border-purple-500/30 text-rose-600 dark:text-rose-400 font-extrabold text-xs tracking-wide shadow-xs">
            <Sparkles size={14} className="text-purple-500" />
            <span>TOPMATE.IO VERIFIED MENTOR</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Book 1:1 Mentorship & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Career Guidance
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get personalized advice, portfolio and resume reviews, mock interviews, and customized roadmaps to accelerate your developer journey.
          </p>

          {/* Social Proof Stats */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Users size={16} />
              </div>
              <span>100+ Learners Guided</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Star size={16} className="fill-amber-500" />
              </div>
              <span>4.9 / 5.0 Star Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              <span>100% Verified Topmate Mentor</span>
            </div>
          </div>

          {/* Hero CTA Button */}
          <div className="pt-4">
            <button
              onClick={() => handleOpenTopmate()}
              className="btn-primary text-base py-4 px-9 rounded-2xl font-black inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white shadow-xl shadow-purple-600/30 border-none cursor-pointer transform hover:-translate-y-0.5 active:scale-98 transition-all"
            >
              <span>Explore All Topmate Services</span>
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Dynamic Cards Section (Fetched from Backend) */}
      {cards.length > 0 && (
        <section className="py-10 px-4">
          <div className="container-max max-w-5xl mx-auto space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Featured <span className="text-purple-600 dark:text-purple-400">1:1 Sessions</span>
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Curated priority slots for deep-dive technical guidance and reviews.
              </p>
            </div>

            <div className={`grid gap-6 ${cards.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : cards.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {cards.map((card) => (
                <TopmateCard key={card._id} cardData={card} variant="card" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mentorship Offerings Grid */}
      <section className="py-12 md:py-16 px-4">
        <div className="container-max max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Available <span className="text-rose-600 dark:text-rose-500">Mentorship Services</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
              Choose the right 1:1 session designed to tackle your immediate coding challenges and career targets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {servicesList.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  onClick={() => handleOpenTopmate(service.url)}
                  className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200/90 dark:border-dark-800 hover:border-purple-500 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${service.color} shadow-xs`}>
                        <Icon size={22} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                          <Clock size={13} />
                          {service.duration}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                          {service.badge}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-dark-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      Book on Topmate <ArrowRight size={14} />
                    </span>
                    <ExternalLink size={14} className="text-slate-400" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3 Step Process */}
      <section className="py-12 px-4 border-t border-slate-200 dark:border-dark-800">
        <div className="container-max max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              How It <span className="text-purple-600 dark:text-purple-400">Works</span>
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Simple 3-step seamless booking process directly via Topmate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500 text-white font-extrabold flex items-center justify-center mx-auto shadow-md">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Select a Service</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose the session type that matches your needs (1:1 call, resume audit, mock interview).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white font-extrabold flex items-center justify-center mx-auto shadow-md">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Pick Date & Time</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your preferred time slot on the live calendar and enter your questions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center mx-auto shadow-md">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Hop on Video Call</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive the Google Meet link immediately and get live, high-impact personalized guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="container-max max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked <span className="text-purple-600 dark:text-purple-400">Questions</span>
            </h2>
            <p className="text-slate-500 text-sm">
              Everything you need to know about booking and preparing for your 1:1 session.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base flex items-center justify-between gap-4 text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-dark-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Direct CTA */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-600 to-rose-600 text-white text-center space-y-4 shadow-xl shadow-purple-600/20">
            <h3 className="text-xl sm:text-2xl font-extrabold">Ready to accelerate your career?</h3>
            <p className="text-xs sm:text-sm text-purple-100 max-w-md mx-auto">
              Book your slot today and let's craft a clear roadmap for your dream developer role.
            </p>
            <button
              onClick={() => handleOpenTopmate()}
              className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm py-3.5 px-8 rounded-xl inline-flex items-center gap-2 shadow-md cursor-pointer transition-all transform hover:-translate-y-0.5 active:scale-98"
            >
              <span>Go to MohitDecodes Topmate</span>
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Topmate;
