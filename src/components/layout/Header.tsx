import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../ui/Button';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isAdmin = false;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
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
          <NavLink to="/login" className="hidden sm:block text-[10px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A] hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            {t('nav.signIn')}
          </NavLink>
          <NavLink 
            to="/search" 
            className="bg-[#1A1A1A] text-[#F9F8F6] text-[10px] uppercase tracking-[0.25em] font-bold px-6 py-3 ml-2 lg:ml-4 hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-colors duration-500 whitespace-nowrap"
          >
            {t('nav.bookNow')}
          </NavLink>
        </div>
      </div>
    </header>
  );
};
