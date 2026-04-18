import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../ui/Button';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#F9F8F6]/90 backdrop-blur-sm border-b border-[#1A1A1A]/10">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 h-20 md:h-24 flex items-center justify-between">
        
        <NavLink to="/" className="text-2xl md:text-3xl font-serif tracking-tight text-[#1A1A1A] hover:text-[#D4AF37] transition-colors duration-500">
          The <span className="italic">Lumière</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-12 text-xs uppercase tracking-[0.25em] font-medium text-[#1A1A1A]">
          <NavLink to="/search" className={({isActive}) => cn("hover:text-[#D4AF37] transition-colors duration-500", isActive && "text-[#D4AF37] relative after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-[#D4AF37]")}>
            Destinations
          </NavLink>
          <NavLink
            to="/search"
            className={({isActive}) => cn("uppercase text-[10px] tracking-[0.2em] font-medium border-b border-[#1A1A1A] pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-500", isActive && "text-[#D4AF37] border-[#D4AF37]")}
          >
            Check Availability
          </NavLink>
          <NavLink to="/dashboard" className={({isActive}) => cn("hover:text-[#D4AF37] transition-colors duration-500", isActive && "text-[#D4AF37] relative after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-[#D4AF37]")}>
            Manage
          </NavLink>
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">
            <span className="text-[#1A1A1A] cursor-pointer hover:text-[#D4AF37] transition-colors">EN</span> 
            <span className="w-px h-3 bg-[#1A1A1A]/20"></span>
            <span className="cursor-pointer hover:text-[#D4AF37] transition-colors">JA</span>
          </div>
          <NavLink to="/login" className="hidden sm:block text-xs uppercase tracking-[0.25em] font-medium text-[#1A1A1A] hover:text-[#D4AF37] transition-colors mr-4">
            Sign In
          </NavLink>
        </div>
      </div>
    </header>
  );
};
