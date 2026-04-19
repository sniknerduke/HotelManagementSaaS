import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../api';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingPhase, setLoadingPhase] = useState<'idle' | 'authenticating' | 'welcome' | 'fading'>('idle');
  const [welcomeName, setWelcomeName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoadingPhase('authenticating');
    try {
      // 1. Call Backend API and ensure the luxury animation plays for at least 1.5 seconds minimum!
      const [response] = await Promise.all([
        AuthService.login({ email, password }),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      
      // 2. We mock storing a dummy token if backend isn't returning it strictly yet
      const token = response.token || 'dummy_token_123';
      
      // 3. Keep to local auth context and get user data
      const userData = await login(token, response.userId);
      setWelcomeName(userData?.firstName || 'Guest');
      
      // Transition to welcome screen
      setLoadingPhase('welcome');

      // Fade out cleanly before leaving
      setTimeout(() => setLoadingPhase('fading'), 2000);

      // 4. Redirect after welcome animation
      setTimeout(() => navigate('/profile'), 2800);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      setLoadingPhase('idle');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">
            {t('login.title')} <span className="italic">{t('login.titleItalic')}</span>
          </h1>
          <p className="text-[#6C6863] text-sm md:text-base font-serif italic">
            {t('login.subtitle')}
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleLogin}>
          {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
          
          <div className="space-y-6">
            <Input 
              label={t('login.emailLabel')} 
              type="email" 
              placeholder={t('login.emailPlaceholder')} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              label={t('login.passwordLabel')} 
              type="password" 
              placeholder={t('login.passwordPlaceholder')} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="accent-[#1A1A1A] w-4 h-4 cursor-pointer align-middle border border-[#1A1A1A] appearance-none checked:bg-[#D4AF37] transition-colors" />
              <span className="text-xs uppercase tracking-[0.1em] text-[#6C6863] group-hover:text-[#1A1A1A] transition-colors">{t('login.rememberMe')}</span>
            </label>
            <a href="#" className="text-xs uppercase tracking-[0.1em] text-[#6C6863] hover:text-[#1A1A1A] transition-colors underline underline-offset-4">
              {t('login.forgotPassword')}
            </a>
          </div>

          <div className="space-y-4 pt-4">
            <Button type="submit" disabled={loadingPhase !== 'idle'} className="w-full">
              {t('login.signIn')}
            </Button>
          </div>
        </form>

        <div className="mt-12 text-center border-t border-[#1A1A1A]/10 pt-8">
          <p className="text-sm text-[#6C6863] mb-4">{t('login.noAccount')}</p>
          <Link to="/register">
            <Button variant="secondary" className="w-full">{t('login.createAccount')}</Button>
          </Link>
        </div>
      </div>

      {/* Luxury Loading & Welcome Animation Overlay */}
      {loadingPhase !== 'idle' && (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#F9F8F6] backdrop-blur-md transition-all duration-700 ${loadingPhase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-in fade-in'}`}>
          
          {/* Phase 1: Authenticating */}
          <div className={`absolute flex flex-col items-center transition-all duration-[800ms] ease-in-out ${loadingPhase === 'authenticating' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border border-[#1A1A1A]/10 rounded-full"></div>
              <div className="absolute inset-0 border border-t-[#D4AF37] rounded-full animate-[spin_2s_linear_infinite]"></div>
              <div className="absolute inset-2 border border-b-[#1A1A1A] rounded-full animate-[spin_2.5s_linear_infinite_reverse]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif italic text-3xl text-[#1A1A1A]">L</span>
              </div>
            </div>
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#1A1A1A] font-bold animate-pulse">
              Welcome Back
            </p>
            <p className="text-xs text-[#6C6863] mt-3 font-serif italic">
              Curating your personalized experience...
            </p>
          </div>
          
          {/* Phase 2: Welcome */}
          <div className={`absolute flex flex-col items-center max-w-md text-center transition-all duration-[1000ms] ease-out transform ${loadingPhase === 'welcome' ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[#D4AF37] animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4 tracking-tight">
                Welcome, <span className="italic text-[#D4AF37]">{welcomeName}</span>.
              </h2>
              <p className="text-[#6C6863] text-sm uppercase tracking-[0.2em] font-medium animate-pulse">
                Your suite awaits
              </p>
              <div className="mt-8 relative w-48 h-px bg-[#1A1A1A]/10 overflow-hidden">
                <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#D4AF37] opacity-60 animate-[slide-right_2s_ease-in-out_infinite]" style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}></div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};
