import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AuthService } from '../../api';

export const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await AuthService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate('/login'), 800);
    } catch (err: any) {
      setError(err.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">
            {t('register.title')} <span className="italic">{t('register.titleItalic')}</span>
          </h1>
          <p className="text-[#6C6863] text-sm md:text-base font-serif italic">
            {t('register.subtitle')}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center mb-4 font-bold">{success}</div>}

          <div className="grid grid-cols-2 gap-4">
            <Input label={t('register.firstName')} name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="John" required />
            <Input label={t('register.lastName')} name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Doe" required />
          </div>
          <Input label={t('register.email')} name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john.doe@example.com" required />
          <Input label={t('register.password')} name="password" value={formData.password} onChange={handleChange} type="password" placeholder="••••••••" required />
          <Input label={t('register.confirmPassword')} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="••••••••" required />

          <label className="flex items-start gap-3 cursor-pointer group mt-4">
            <input type="checkbox" className="mt-1 accent-[#1A1A1A] w-4 h-4 shrink-0 cursor-pointer border border-[#1A1A1A] appearance-none checked:bg-[#D4AF37] transition-colors" required />
            <span className="text-xs text-[#6C6863] group-hover:text-[#1A1A1A] transition-colors leading-relaxed">
              {t('register.agreeTo')} <Link to="/terms" className="underline text-[#1A1A1A]">{t('footer.termsOfService')}</Link> {t('register.and')} <Link to="/privacy" className="underline text-[#1A1A1A]">{t('footer.privacyPolicy')}</Link>.
            </span>
          </label>

          <Button type="submit" disabled={loading} className="w-full mt-8">
            {loading ? 'Processing...' : t('register.registerNow')}
          </Button>
        </form>

        <div className="mt-12 text-center border-t border-[#1A1A1A]/10 pt-8 text-sm">
          <span className="text-[#6C6863]">{t('register.alreadyHave')} </span>
          <Link to="/login" className="text-[#1A1A1A] font-medium underline underline-offset-4 hover:text-[#D4AF37] transition-colors">
            {t('register.signIn')}
          </Link>
        </div>
      </div>
    </div>
  );
};
