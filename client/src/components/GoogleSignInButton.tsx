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
  const [scriptLoaded, setScriptLoaded] = useState(false);

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
      if (window.google?.accounts?.id) {
        setScriptLoaded(true);
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
        }
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

  return (
    <div className="relative w-full">
      {/* Target element rendered by Google Identity Services */}
      <div
        ref={buttonContainerRef}
        className="w-full flex justify-center items-center overflow-hidden rounded-xl min-h-[44px]"
      />

      {loading && (
        <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-xs flex items-center justify-center rounded-xl z-20 text-xs font-semibold text-purple-400">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2" />
          Signing in with Google...
        </div>
      )}
    </div>
  );
};
