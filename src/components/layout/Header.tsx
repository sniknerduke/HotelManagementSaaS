import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const changeLanguage = (lng: string) => {
    if (i18n.language === lng) return;
    setIsChangingLanguage(true);
    setTimeout(() => {
      i18n.changeLanguage(lng);
      setIsChangingLanguage(false);
    }, 500);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[110] bg-[#F9F8F6]/90 backdrop-blur-sm border-b border-[#1A1A1A]/10">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 h-16 lg:h-20 flex items-center justify-between relative">
        
        <NavLink to="/" className="text-xl md:text-2xl font-serif tracking-tight text-[#1A1A1A] hover:text-[#D4AF37] transition-colors duration-500 z-10 flex-1">
          The <span className="italic">Lumière</span>
        </NavLink>

        <nav className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 gap-10 lg:gap-14 text-xs uppercase tracking-[0.25em] font-medium text-[#1A1A1A] z-20">
          <NavLink to="/" className={({isActive}) => cn("hover:text-[#D4AF37] transition-colors duration-500", isActive && "text-[#D4AF37] relative after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-[#D4AF37]")}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/search" className={({isActive}) => cn("hover:text-[#D4AF37] transition-colors duration-500", isActive && "text-[#D4AF37] relative after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-[#D4AF37]")}>
            {t('nav.rooms')}
          </NavLink>
          <NavLink to="/amenities" className={({isActive}) => cn("hover:text-[#D4AF37] transition-colors duration-500", isActive && "text-[#D4AF37] relative after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-[#D4AF37]")}>
            {t('nav.amenities')}
          </NavLink>
          <NavLink to="/contact" className={({isActive}) => cn("hover:text-[#D4AF37] transition-colors duration-500", isActive && "text-[#D4AF37] relative after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-[#D4AF37]")}>
            {t('nav.contact')}
          </NavLink>
        </nav>

        <div className="flex items-center gap-6 z-10 flex-1 justify-end">
          <div className="hidden xl:flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">
            <span onClick={() => changeLanguage('en')} className={cn("cursor-pointer hover:text-[#D4AF37] transition-colors", i18n.language === 'en' ? "text-[#1A1A1A] font-bold" : "")}>EN</span> 
            <span className="w-px h-3 bg-[#1A1A1A]/20"></span>
            <span onClick={() => changeLanguage('vi')} className={cn("cursor-pointer hover:text-[#D4AF37] transition-colors", i18n.language === 'vi' ? "text-[#1A1A1A] font-bold" : "")}>VN</span>
          </div>

          {user ? (
            <div className="hidden sm:flex items-center gap-4 relative group cursor-pointer py-4 h-full">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors whitespace-nowrap flex items-center gap-1">
                {user.firstName}
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <div className="absolute top-full right-0 mt-0 w-40 bg-[#F9F8F6] border border-[#1A1A1A]/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 flex flex-col">
                <NavLink to={user.role === 'ADMIN' ? "/admin" : "/profile"} className="px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors whitespace-nowrap text-left border-b border-[#1A1A1A]/5">
                    {user.role === 'ADMIN' ? 'Dashboard' : 'Profile'}
                </NavLink>
                <button onClick={handleLogout} className="px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A] hover:bg-red-50 hover:text-red-600 transition-colors whitespace-nowrap text-left w-full">
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <NavLink to="/login" className="hidden sm:block text-[10px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A] hover:text-[#D4AF37] transition-colors whitespace-nowrap">
              {t('nav.signIn')}
            </NavLink>
          )}

          <NavLink 
            to="/search" 
            className="bg-[#1A1A1A] text-[#F9F8F6] text-[10px] uppercase tracking-[0.25em] font-bold px-6 py-3 ml-2 lg:ml-4 hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-colors duration-500 whitespace-nowrap"
          >
            {t('nav.bookNow')}
          </NavLink>
        </div>
      </div>
    </header>

    {/* Luxury Loading Blur Overlay */}
    {isChangingLanguage && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F9F8F6]/40 backdrop-blur-[4px] transition-all duration-500 animate-in fade-in">
        <div className="w-12 h-12 border border-[#1A1A1A]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    )}
    </>
  );
};
