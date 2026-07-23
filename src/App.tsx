import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Sparkles, 
  Cpu, 
  Globe, 
  Leaf, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react';

// Actual real testimonials from NexusCraft website
const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "AI Developer at Tech Corp",
    avatar: "PS",
    text: "NexusCraft transformed my career. The AI track gave me practical skills I use daily. Within 6 months, I landed my dream job as an AI developer!",
    achievement: "🎯 Completed 45 AI modules • 2,340 credits"
  },
  {
    name: "Alex Mercer",
    role: "Climate Tech Researcher",
    avatar: "AM",
    text: "Using machine learning to analyze deforestation patterns on the platform was mind-blowing. The community is incredibly collaborative and driven.",
    achievement: "🌱 12 Environmental Projects Completed"
  },
  {
    name: "Sarah Jenkins",
    role: "Sustainability Director",
    avatar: "SJ",
    text: "The combination of cutting-edge AI courses and environmental conservation challenges makes NexusCraft unique. Highly recommended for modern changemakers.",
    achievement: "🏆 1st Place in Global GreenTech Hackathon"
  }
];

// Highlight features of the platform
const PLATFORM_FEATURES = [
  {
    icon: Cpu,
    title: "AI Development",
    desc: "Master practical machine learning, neural networks, and prompt engineering."
  },
  {
    icon: Leaf,
    title: "Eco Innovation",
    desc: "Apply technology directly to solve real-world climate and sustainability challenges."
  },
  {
    icon: Users,
    title: "Global Community",
    desc: "Collaborate with developers, researchers, and creators from over 120 countries."
  }
];

function GoogleCallbackHandler() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      setStatus('error');
      setErrorMessage('No authorization code found in redirect URL.');
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await fetch(`/api/auth/google/callback?code=${encodeURIComponent(code)}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to authenticate with Google.');
        }

        const data = await response.json();
        if (data.success && data.user) {
          setStatus('success');
          if (window.opener) {
            window.opener.postMessage({
              type: 'OAUTH_AUTH_SUCCESS',
              user: data.user
            }, '*');
            setTimeout(() => {
              window.close();
            }, 1200);
          } else {
            // Fallback if no opener (e.g. redirected in same window)
            setStatus('error');
            setErrorMessage('Could not connect back to the login page window.');
          }
        } else {
          throw new Error('Invalid response from authentication server.');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Verification failed.');
        if (window.opener) {
          window.opener.postMessage({
            type: 'OAUTH_AUTH_FAILURE',
            error: err.message || 'Verification failed.'
          }, '*');
          setTimeout(() => {
            window.close();
          }, 2500);
        }
      }
    };

    exchangeCode();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="w-full max-w-md bg-[#0f141f99] backdrop-blur-xl border border-cyan-500/10 rounded-3xl p-8 shadow-2xl relative text-center z-10">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="text-white w-6 h-6 animate-pulse" />
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
            NexusCraft
          </span>
        </div>

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="flex justify-center py-4">
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            </div>
            <h2 className="text-lg font-bold">Verifying Google Account</h2>
            <p className="text-xs text-gray-450 leading-relaxed">
              Connecting securely with NexusCraft AI Hub. Please keep this window open while we complete your authentication.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="flex justify-center py-4">
              <CheckCircle className="w-12 h-12 text-emerald-450" />
            </div>
            <h2 className="text-lg font-bold text-emerald-400">Authentication Successful!</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Successfully verified. Redirecting you back to the NexusCraft dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center py-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                <span className="text-red-400 text-xl font-bold">!</span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-red-400">Authentication Failed</h2>
            <p className="text-xs text-gray-450 leading-relaxed">
              {errorMessage}
            </p>
            <p className="text-[10px] text-gray-500">
              This window will close automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResetPasswordHandler() {
  const [status, setStatus] = useState<'verifying' | 'input' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token') || '';
  const email = urlParams.get('email') || '';

  useEffect(() => {
    if (!token || !email) {
      setStatus('error');
      setErrorMessage('The password reset link is invalid or incomplete. Please request a new link.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verify-reset-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, email })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'This password reset link is invalid or has expired.');
        }

        setStatus('input');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Token verification failed.');
      }
    };

    verifyToken();
  }, [token, email]);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!password) {
      setErrorMessage('Please enter a new password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setStatus('success');
      setSuccessMessage(data.message || 'Password updated successfully!');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-[#0f141f99] backdrop-blur-xl border border-cyan-500/10 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
            NexusCraft
          </span>
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-extrabold">Secure Password Reset</span>
        </div>

        {status === 'verifying' && (
          <div className="space-y-4 text-center py-6">
            <div className="flex justify-center">
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-white">Verifying reset token...</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Please wait while we validate your secure password reset credentials.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 text-center py-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 text-xl font-extrabold">
                !
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-400">Invalid Link</h2>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="w-full bg-[#111625] border border-cyan-500/10 hover:border-cyan-500/20 text-gray-200 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-xs cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 text-center py-4">
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-450" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-450">Password Updated</h2>
              <p className="text-xs text-gray-450 mt-2 leading-relaxed">
                {successMessage}
              </p>
            </div>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-350 hover:to-blue-450 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-xs tracking-wider cursor-pointer"
            >
              Continue to Login
            </button>
          </div>
        )}

        {status === 'input' && (
          <form onSubmit={handleResetSubmit} className="space-y-5">
            <p className="text-xs text-gray-400 text-center leading-relaxed mb-4">
              Enter a new secure password for <span className="text-cyan-400 font-semibold">{email}</span>.
            </p>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium">
                {errorMessage}
              </div>
            )}

            {/* Password field */}
            <div className="relative">
              <label 
                className={`absolute left-3.5 -top-2 px-1.5 bg-[#0f141f] text-[11px] font-bold tracking-wide transition-all duration-200 rounded-md ${
                  isPasswordFocused || password 
                    ? 'text-cyan-400 opacity-100' 
                    : 'text-gray-500 opacity-80'
                }`}
                style={{ zIndex: 10 }}
              >
                New Password*
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className={`w-full px-4 py-3.5 pr-12 rounded-xl text-base border transition-all duration-200 outline-none bg-[#0a0e17]/80 text-white min-h-[48px] ${
                  isPasswordFocused 
                    ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'border-[#1e293b] hover:border-gray-700'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors w-11 h-11 flex items-center justify-center cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 opacity-70" />
                ) : (
                  <Eye className="w-5 h-5 opacity-70" />
                )}
              </button>
            </div>

            {/* Confirm password field */}
            <div className="relative">
              <label 
                className={`absolute left-3.5 -top-2 px-1.5 bg-[#0f141f] text-[11px] font-bold tracking-wide transition-all duration-200 rounded-md ${
                  isConfirmFocused || confirmPassword 
                    ? 'text-cyan-400 opacity-100' 
                    : 'text-gray-500 opacity-80'
                }`}
                style={{ zIndex: 10 }}
              >
                Confirm Password*
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setIsConfirmFocused(true)}
                onBlur={() => setIsConfirmFocused(false)}
                className={`w-full px-4 py-3.5 pr-12 rounded-xl text-base border transition-all duration-200 outline-none bg-[#0a0e17]/80 text-white min-h-[48px] ${
                  isConfirmFocused 
                    ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'border-[#1e293b] hover:border-gray-700'
                }`}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-350 hover:to-blue-450 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-sm tracking-wider select-none cursor-pointer shadow-lg shadow-cyan-500/20 min-h-[48px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const isCallbackPath = window.location.pathname === '/auth/google/callback';
  const isResetPasswordPath = window.location.pathname === '/auth/reset-password';

  if (isCallbackPath) {
    return <GoogleCallbackHandler />;
  }

  if (isResetPasswordPath) {
    return <ResetPasswordHandler />;
  }

  const [isLogin, setIsLogin] = useState(true); // Toggle between Log In and Sign Up (default to Login as is typical)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Extra field for signup
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; email: string; picture?: string } | null>(null);

  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [devResetLink, setDevResetLink] = useState<string | null>(null);

  // Testimonial carousel state
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Floating particles background effect
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate random stable particles
    const initialParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 10
    }));
    setParticles(initialParticles);

    // Testimonial auto-rotation
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Listen for Google Auth callback responses from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Trust local dev as well as the run.app dynamic container origins and the current page's origin
      if (
        origin !== window.location.origin &&
        !origin.endsWith('.run.app') && 
        !origin.includes('localhost') && 
        !origin.includes('127.0.0.1')
      ) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setIsLoading(false);
        const { user } = event.data;
        setLoggedInUser(user);
        setAuthSuccess(`Successfully authenticated! Welcome, ${user.name}.`);
      } else if (event.data?.type === 'OAUTH_AUTH_FAILURE') {
        setIsLoading(false);
        setError(event.data.error || 'Google Sign-In failed.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAuthSuccess(null);

    // Basic Validation
    if (!isLogin && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin ? { email, password } : { name, email, password };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      setLoggedInUser(data.user);
      if (isLogin) {
        setAuthSuccess(`Welcome back to NexusCraft, ${data.user.name}! Redirecting to dashboard...`);
      } else {
        setAuthSuccess(`Account created successfully! Welcome, ${data.user.name}.`);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAuthSuccess(null);
    setDevResetLink(null);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate reset link.');
      }

      setAuthSuccess(data.message);
      if (data.devLink) {
        setDevResetLink(data.devLink);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setAuthSuccess(null);

    try {
      const response = await fetch('/api/auth/google/url');
      if (!response.ok) {
        throw new Error('Failed to fetch authentication URL from server.');
      }
      const { url } = await response.json();

      const width = 500;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        url,
        'google_oauth',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );

      if (!popup) {
        setIsLoading(false);
        setError('Popup blocked! Please enable popups for this site to sign in with Google.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Error initiating Google Sign-In.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col lg:flex-row font-sans antialiased overflow-x-hidden relative">
      
      {/* 1. FLOATING PARTICLE BACKDROP */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 blur-[1px]"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `float-up ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
              boxShadow: '0 0 8px rgba(6, 182, 212, 0.4)'
            }}
          />
        ))}
      </div>

      {/* STYLES FOR FLOATING PARTICLES */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(110vh) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.35;
          }
          90% {
            opacity: 0.35;
          }
          100% {
            transform: translateY(-10vh) translateX(40px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>

      {/* 2. LEFT SIDE PANEL: PREMIUM BRANDING & IMPACT COPY (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative bg-[#070b14] border-r border-[#06b6d4]/10 flex-col justify-between p-12 overflow-hidden select-none z-10">
        
        {/* Modern Creative Workspace Image Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/creative_workspace_1784101752086.jpg"
            alt="NexusCraft Workspace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-15 filter brightness-75 contrast-125 saturate-50"
          />
          {/* Neon gradients and glows */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#070b14]/90 to-[#070b14]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0e1a]"></div>
          {/* Glowing orb */}
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>

        {/* Brand Top Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="text-white w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-wide">NexusCraft</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-400 border border-cyan-400/20">
                AI HUB
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Environmental Innovation Platform</p>
          </div>
        </div>

        {/* Center Copy and Feature Highlights */}
        <div className="relative z-10 my-auto py-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full tracking-wider uppercase mb-6 border border-cyan-400/20">
            <Zap className="w-3.5 h-3.5" /> Sustainable Future Tech
          </span>
          
          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight mb-6">
            Master AI skills through <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              real-world projects
            </span>
          </h2>
          
          <p className="text-gray-400 text-sm xl:text-base leading-relaxed mb-10 max-w-md">
            Join a global community of innovators using artificial intelligence to solve climate change, optimize green energy, and contribute to sustainability.
          </p>

          {/* Core App Features List */}
          <div className="space-y-6 max-w-sm">
            {PLATFORM_FEATURES.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="p-2.5 bg-[#0f172a] border border-[#06b6d4]/20 rounded-xl shrink-0 flex items-center justify-center shadow-md">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-200">{feat.title}</h4>
                    <p className="text-xs text-gray-400 leading-normal mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials Slideshow */}
        <div className="relative z-10 bg-[#0f172a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 max-w-md shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
                  User Review
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm italic leading-relaxed">
                "{TESTIMONIALS[testimonialIndex].text}"
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {TESTIMONIALS[testimonialIndex].avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-white">{TESTIMONIALS[testimonialIndex].name}</h4>
                    <p className="text-[11px] text-gray-400">{TESTIMONIALS[testimonialIndex].role}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                    className="p-1.5 bg-[#1e293b] hover:bg-[#334155] rounded-lg transition-colors cursor-pointer border border-white/5"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-300" />
                  </button>
                  <button
                    onClick={() => setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
                    className="p-1.5 bg-[#1e293b] hover:bg-[#334155] rounded-lg transition-colors cursor-pointer border border-white/5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </button>
                </div>
              </div>
              <div className="text-[11px] text-cyan-400/90 font-medium flex items-center gap-1 bg-[#1e293b]/40 py-1.5 px-3 rounded-lg border border-cyan-400/5">
                {TESTIMONIALS[testimonialIndex].achievement}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* 3. RIGHT SIDE PANEL: AUTHENTIC, GLASSMORPHIC LOGIN/SIGNUP FORM */}
      <div className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-16 z-10">
        
        {/* Soft glowing ambient backgrounds for mobile (or to look futuristic) */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none lg:hidden"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none lg:hidden"></div>

        <div className="w-full max-w-[420px] mx-auto flex flex-col items-center">
          
          {/* Logo container styled identically with rounding and gradient but using modern clean styles */}
          <div id="logo-container" className="mb-6 select-none flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:rotate-3 cursor-pointer">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide select-none">
              NexusCraft
            </span>
          </div>

          {/* Main Container Card (Glassmorphic to match the web app dashboard aesthetic) */}
          <div className="w-full bg-[#0f141f99] backdrop-blur-xl border border-cyan-500/10 rounded-3xl p-6 md:p-8 shadow-2xl relative">
            
            {/* Elegant corner glow accent */}
            <div className="absolute -top-px -left-px w-20 h-20 bg-gradient-to-br from-cyan-500 to-transparent opacity-30 blur-[2px] rounded-tl-3xl pointer-events-none"></div>

            {/* Welcome message header */}
            <div className="text-center mb-8">
              <h1 id="welcome-heading" className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Welcome
              </h1>
              <p className="text-sm font-semibold tracking-wide text-gray-400">
                {isLogin ? 'Log In to NexusCraft.' : 'Sign Up to NexusCraft.'}
              </p>
            </div>

            {/* Success and Error messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs text-left font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                    {error}
                  </div>
                </motion.div>
              )}

              {authSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2.5 text-xs text-left">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold">{authSuccess}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loggedInUser ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    {loggedInUser.picture ? (
                      <img 
                        src={loggedInUser.picture} 
                        alt={loggedInUser.name} 
                        className="w-20 h-20 rounded-full border-2 border-cyan-400 p-0.5 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-2xl font-bold text-white border-2 border-cyan-400 p-0.5">
                        {loggedInUser.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-cyan-400 text-[#070b14] p-1 rounded-full border-2 border-[#070b14]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-white">{loggedInUser.name}</h3>
                  <p className="text-xs text-cyan-400/80 font-medium mt-0.5">{loggedInUser.email}</p>
                  
                  <div className="mt-3.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                    Google Verified Learner
                  </div>
                </div>

                <div className="bg-[#0a0e17]/80 rounded-2xl p-4 border border-cyan-500/10 space-y-3">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Your Next Steps</h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 text-xs text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      <span>Explore the Interactive AI Track</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      <span>Participate in Eco Challenges</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      <span>Complete your Learner Profile</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => {
                      setAuthSuccess(`Connecting to NexusCraft Dashboard Hub... Welcome, ${loggedInUser.name}!`);
                    }}
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-350 hover:to-blue-450 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-sm tracking-wider select-none cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
                  >
                    <span>Enter Hub Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setLoggedInUser(null);
                      setAuthSuccess(null);
                      setError(null);
                    }}
                    className="w-full bg-transparent border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-xs font-semibold cursor-pointer active:scale-[0.98]"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : isForgotPasswordMode ? (
              <div className="space-y-5">
                <div className="text-center mb-1">
                  <h3 className="text-lg font-bold text-white">Reset Password</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Enter your registered email address to receive a secure, time-limited password recovery link.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium">
                    {error}
                  </div>
                )}

                {authSuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-3">
                    <p className="text-xs text-emerald-400 font-semibold leading-relaxed">
                      {authSuccess}
                    </p>
                    {/* Sandbox Mail Interceptor for local testing in preview */}
                    {devResetLink && (
                      <div className="pt-2.5 border-t border-emerald-500/20 text-left">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider text-cyan-400 block mb-1">
                          🛠️ Sandbox Mail Interceptor (Preview Only)
                        </span>
                        <p className="text-[10px] text-gray-400 leading-normal mb-2">
                          Since we don't send live emails in this environment, click the link below to directly open your secure password reset view:
                        </p>
                        <a
                          href={devResetLink}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline bg-cyan-500/10 hover:bg-cyan-500/20 py-2.5 px-3 rounded-lg border border-cyan-500/20 transition-all cursor-pointer w-full justify-center"
                        >
                          <span>Open Password Reset Link</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                  <div className="relative">
                    <label 
                      htmlFor="forgot-email-input"
                      className={`absolute left-3.5 -top-2 px-1.5 bg-[#0f141f] text-[11px] font-bold tracking-wide transition-all duration-200 rounded-md ${
                        isEmailFocused || email 
                          ? 'text-cyan-400 opacity-100' 
                          : 'text-gray-500 opacity-80'
                      }`}
                      style={{ zIndex: 10 }}
                    >
                      Email address*
                    </label>
                    <input
                      id="forgot-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      className={`w-full px-4 py-3.5 rounded-xl text-base border transition-all duration-200 outline-none bg-[#0a0e17]/80 text-white min-h-[48px] ${
                        isEmailFocused 
                          ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                          : 'border-cyan-500/30'
                      }`}
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-350 hover:to-blue-450 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-sm tracking-wider select-none cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-[0.98] min-h-[48px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordMode(false);
                      setError(null);
                      setAuthSuccess(null);
                      setDevResetLink(null);
                    }}
                    className="text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to login</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* AUTH FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Full Name field (Visible only during Sign Up) */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative overflow-hidden"
                      >
                        <label 
                          htmlFor="name-input"
                          className={`absolute left-3.5 -top-2 px-1.5 bg-[#0f141f] text-[11px] font-bold tracking-wide transition-all duration-200 rounded-md ${
                            isNameFocused || name 
                              ? 'text-cyan-400 opacity-100' 
                              : 'text-gray-500 opacity-80'
                          }`}
                          style={{ zIndex: 10 }}
                        >
                          Full Name*
                        </label>
                        <input
                          id="name-input"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setIsNameFocused(true)}
                          onBlur={() => setIsNameFocused(false)}
                          className={`w-full px-4 py-3.5 rounded-xl text-base border transition-all duration-200 outline-none bg-[#0a0e17]/80 text-white min-h-[48px] ${
                            isNameFocused 
                              ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                              : 'border-[#1e293b] hover:border-gray-700'
                          }`}
                          placeholder={isNameFocused ? '' : ''}
                          disabled={isLoading}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                
                  {/* Email address field with float label */}
                  <div className="relative">
                    <label 
                      htmlFor="email-input"
                      className={`absolute left-3.5 -top-2 px-1.5 bg-[#0f141f] text-[11px] font-bold tracking-wide transition-all duration-200 rounded-md ${
                        isEmailFocused || email 
                          ? 'text-cyan-400 opacity-100' 
                          : 'text-gray-500 opacity-80'
                      }`}
                      style={{ zIndex: 10 }}
                    >
                      Email address*
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      className={`w-full px-4 py-3.5 rounded-xl text-base border transition-all duration-200 outline-none bg-[#0a0e17]/80 text-white min-h-[48px] ${
                        isEmailFocused 
                          ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                          : 'border-cyan-500/30'
                      }`}
                      placeholder={isEmailFocused ? '' : ''}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password field with reveal button */}
                  <div className="relative">
                    <label 
                      htmlFor="password-input"
                      className={`absolute left-3.5 -top-2 px-1.5 bg-[#0f141f] text-[11px] font-bold tracking-wide transition-all duration-200 rounded-md ${
                        isPasswordFocused || password 
                          ? 'text-cyan-400 opacity-100' 
                          : 'text-gray-500 opacity-80'
                      }`}
                      style={{ zIndex: 10 }}
                    >
                      Password*
                    </label>
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      className={`w-full px-4 py-3.5 pr-12 rounded-xl text-base border transition-all duration-200 outline-none bg-[#0a0e17]/80 text-white min-h-[48px] ${
                        isPasswordFocused 
                          ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                          : 'border-[#1e293b] hover:border-gray-700'
                      }`}
                      placeholder={isPasswordFocused ? '' : ''}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      id="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors w-11 h-11 flex items-center justify-center cursor-pointer active:scale-95"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 opacity-70" />
                      ) : (
                        <Eye className="w-5 h-5 opacity-70" />
                      )}
                    </button>
                  </div>

                  {/* Keep Remember Me & Forgot Password option (very professional!) */}
                  {isLogin && (
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-700 bg-gray-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 h-4.5 w-4.5 cursor-pointer" 
                        />
                        <span className="text-xs">Remember me</span>
                      </label>
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsForgotPasswordMode(true);
                          setError(null);
                          setAuthSuccess(null);
                        }}
                        className="hover:text-cyan-400 transition-colors font-medium cursor-pointer py-1 text-xs"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {/* Submit Button with matching neon cyan gradient styling */}
                  <button
                    id="continue-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-350 hover:to-blue-450 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-sm tracking-wider select-none cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-[0.98] mt-6 min-h-[48px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      'Continue'
                    )}
                  </button>

                </form>

                {/* Sign Up / Log In toggler */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-400">
                    {isLogin ? (
                      <>
                        New to NexusCraft?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setIsLogin(false);
                            setError(null);
                            setAuthSuccess(null);
                          }}
                          className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline focus:outline-none cursor-pointer"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setIsLogin(true);
                            setError(null);
                            setAuthSuccess(null);
                          }}
                          className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline focus:outline-none cursor-pointer"
                        >
                          Log in
                        </button>
                      </>
                    )}
                  </p>
                </div>

                {/* Divider "OR" with horizontal glowing lines */}
                <div className="my-6 flex items-center">
                  <div className="flex-grow border-t border-cyan-500/10"></div>
                  <span className="mx-4 text-[10px] font-extrabold text-gray-500 select-none uppercase tracking-widest">OR</span>
                  <div className="flex-grow border-t border-cyan-500/10"></div>
                </div>

                {/* Google Single Sign-on Button styled beautifully to match dark mode */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-[#111625] border border-cyan-500/10 hover:border-cyan-500/20 text-gray-200 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-xs cursor-pointer hover:bg-[#151b2d] active:scale-[0.98]"
                >
                  {/* Google logo */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </>
            )}

          </div>

          {/* Footer of the login page */}
          <div className="mt-8 text-center text-[11px] text-gray-500 select-none">
            <p>© 2026 NexusCraft AI Hub. All rights reserved.</p>
            <p className="mt-1">Empowering learners for a sustainable future.</p>
          </div>

        </div>
      </div>

    </div>
  );
}
