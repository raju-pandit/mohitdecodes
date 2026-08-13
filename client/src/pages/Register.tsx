import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, CheckCircle2, Loader2, RotateCcw, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import BrandLogo from '../components/Logo';
import * as authService from '../services/authService';

const Register: React.FC = () => {
  const { user, signupSms } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  
  // 6-digit OTP pin inputs
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for Resend OTP (45 seconds)
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast.error('Please enter your full name');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setSendingOtp(true);
    try {
      await authService.sendOtp(phone);
      toast.success(`OTP sent to +91 ${phone}`);
      setStep('otp');
      setCountdown(45);
      // Focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 200);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to send OTP. Please try again.';
      toast.error(msg);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto advance focus
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || '';
      }
      setOtpDigits(newDigits);
      const targetIndex = Math.min(pastedData.length, 5);
      otpInputRefs.current[targetIndex]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setSendingOtp(true);
    try {
      await authService.sendOtp(phone);
      toast.success(`New OTP sent to +91 ${phone}`);
      setCountdown(45);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to resend OTP.';
      toast.error(msg);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    setVerifyingOtp(true);
    try {
      // 1. Verify OTP with backend
      await authService.verifyOtp(phone, fullOtp);
      toast.success('OTP verified!');

      // 2. Create account / Sign in user
      await signupSms(name, phone);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'OTP verification failed.';
      toast.error(msg);
    } finally {
      setVerifyingOtp(false);
    }
  };

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
          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.form
                key="step-phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp}
                className="space-y-5"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                    <User size={14} className="text-primary-400" /> Full Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Mohit Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input w-full"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                    <Phone size={14} className="text-primary-400" /> Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1 text-slate-400 text-sm font-bold select-none border-r border-dark-700 pr-2.5">
                      <span>🇮🇳</span>
                      <span className="text-slate-200">+91</span>
                    </div>
                    <input
                      required
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="input w-full pl-20 tracking-wider font-semibold text-slate-100"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">We will send a 6-digit OTP to verify your phone number.</p>
                </div>

                <button
                  type="submit"
                  disabled={sendingOtp || !name.trim() || phone.length !== 10}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 cursor-pointer"
                >
                  {sendingOtp ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending OTP...</>
                  ) : (
                    <><Phone className="w-4 h-4" /> Send OTP <ArrowRight className="w-4 h-4 ml-1" /></>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-5"
              >
                <div className="text-center bg-primary-950/40 p-3.5 rounded-xl border border-primary-500/20 mb-2">
                  <p className="text-xs text-slate-400">OTP sent to mobile number</p>
                  <p className="text-sm font-bold text-primary-300 flex items-center justify-center gap-2 mt-0.5">
                    +91 {phone}
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="text-[11px] font-normal text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Change
                    </button>
                  </p>
                </div>

                {/* 6-Digit OTP Box Grid */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-3 text-center uppercase tracking-wider">
                    Enter 6-digit OTP
                  </label>
                  <div className="flex justify-between gap-2 max-w-xs mx-auto">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="w-11 h-12 text-center text-xl font-bold bg-dark-900 border border-dark-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 rounded-xl text-white outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                {/* Verify OTP Button */}
                <button
                  type="submit"
                  disabled={verifyingOtp || otpDigits.join('').length !== 6}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 cursor-pointer"
                >
                  {verifyingOtp ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Verifying OTP...</>
                  ) : (
                    <><ShieldCheck className="w-5 h-5" /> Verify OTP & Create Account</>
                  )}
                </button>

                {/* Resend OTP & Countdown */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400">
                    Didn't receive OTP?{' '}
                    {countdown > 0 ? (
                      <span className="text-purple-400 font-semibold ml-1">
                        Resend in {countdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={sendingOtp}
                        className="text-purple-400 hover:text-purple-300 font-bold underline ml-1 cursor-pointer inline-flex items-center gap-1"
                      >
                        <RotateCcw size={12} /> Resend OTP
                      </button>
                    )}
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social Divider */}
          <div className="relative my-6">
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
  );
};

export default Register;
