import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '947632566198-m5130g3m4dmsa0afof1vb3deeg4hs3fr.apps.googleusercontent.com';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  className?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSuccess }) => {
  const { googleAuth } = useAuth();
  const navigate = useNavigate();
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [gisRendered, setGisRendered] = useState(false);

  useEffect(() => {
    const handleCredentialResponse = async (response: any) => {
      if (!response?.credential) {
        toast.error('Google login failed or was cancelled.');
        return;
      }

      setLoading(true);
      try {
        await googleAuth(response.credential);
        toast.success('Successfully logged in with Google!');
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/dashboard');
        }
      } catch (err: any) {
        console.error('Google Sign-In backend verification error:', err);
        const errMsg = err?.response?.data?.message || err?.error || err?.message || 'Google Sign-In failed. Please try again.';
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    };

    const initGsi = () => {
      try {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (buttonContainerRef.current) {
            buttonContainerRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(buttonContainerRef.current, {
              type: 'standard',
              theme: 'filled_black',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 380,
            });
            setGisRendered(true);
          }
        }
      } catch (err) {
        console.warn('Google Identity Services Initialization warning:', err);
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGsi();
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [googleAuth, navigate, onSuccess]);

  const handleFallbackClick = () => {
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Google Prompt notification state:', notification.getNotDisplayedReason());
          }
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      toast.error('Google Sign-In service loading... Please try again in a moment.');
    }
  };

  return (
    <div className="relative w-full">
      {/* Target element rendered by Google Identity Services */}
      <div
        ref={buttonContainerRef}
        className="w-full flex justify-center items-center overflow-hidden rounded-xl min-h-[44px]"
      />

      {/* Fallback button if GIS button container is empty before render */}
      {!gisRendered && (
        <button
          type="button"
          onClick={handleFallbackClick}
          className="w-full py-2.5 px-4 rounded-xl border border-dark-700 bg-dark-800/60 hover:bg-dark-800 text-sm font-semibold text-slate-200 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      )}

      {loading && (
        <div className="absolute inset-0 bg-dark-950/90 backdrop-blur-xs flex items-center justify-center rounded-xl z-20 text-xs font-semibold text-purple-400">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2" />
          Signing in with Google...
        </div>
      )}
    </div>
  );
};
