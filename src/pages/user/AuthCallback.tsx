import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (token && userId) {
      // Simulate verifying token securely
      setTimeout(() => {
        login(token, userId).then(() => {
          // Redirect to profile smoothly
          navigate('/profile');
        });
      }, 1500);
    } else {
      // Invalid callback -> login page
      navigate('/login');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-8 bg-[#F9F8F6] min-h-screen">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border border-[#1A1A1A]/10 rounded-full"></div>
        <div className="absolute inset-0 border border-t-[#D4AF37] rounded-full animate-[spin_2s_linear_infinite]"></div>
        <div className="absolute inset-2 border border-b-[#1A1A1A] rounded-full animate-[spin_2.5s_linear_infinite_reverse]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif italic text-3xl text-[#1A1A1A]">L</span>
        </div>
      </div>
      <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#1A1A1A] font-bold animate-pulse mb-3">
        Verifying via Provider
      </p>
      <p className="text-xs text-[#6C6863] font-serif italic">
        Finalizing your secure access...
      </p>
    </div>
  );
};
