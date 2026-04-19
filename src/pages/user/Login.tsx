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
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      // 1. Call Backend API
      const response = await AuthService.login({ email, password });
      
      // 2. We mock storing a dummy token if backend isn't returning it strictly yet
      const token = response.token || 'dummy_token_123';
      
      // 3. Keep to local auth context
      await login(token, response.userId);
      
      // 4. Redirect
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
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
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Processing...' : t('login.signIn')}
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
    </div>
  );
};
