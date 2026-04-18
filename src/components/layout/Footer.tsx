import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1A1A] text-[#F9F8F6] pt-24 md:pt-32 pb-12 mt-24">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-x-8 mb-24 lg:mb-32">
          
          <div className="md:col-span-4 lg:col-span-5 md:pr-12">
            <h2 className="text-4xl md:text-5xl font-serif text-[#F9F8F6] mb-8 leading-[1.1]">
              <span className="italic text-[#D4AF37]">Sign up</span> for our<br />exclusive newsletters.
            </h2>
            <div className="flex flex-col max-w-md gap-4">
              <Input 
                placeholder="Email Address" 
                className="text-[#F9F8F6] border-[#F9F8F6]/20 placeholder:text-[#6C6863] focus:border-[#D4AF37]" 
              />
              <Button variant="secondary" className="border-[#F9F8F6]/20 text-[#F9F8F6] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#1A1A1A] mt-2">
                Subscribe
              </Button>
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-7 lg:col-start-8">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-6">Explore</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><NavLink to="/" className="hover:text-[#D4AF37] transition-colors duration-500">The Estate</NavLink></li>
              <li><NavLink to="/search" className="hover:text-[#D4AF37] transition-colors duration-500">Destinations</NavLink></li>
              <li><NavLink to="/amenities" className="hover:text-[#D4AF37] transition-colors duration-500">Amenities</NavLink></li>
              <li><NavLink to="/experiences" className="hover:text-[#D4AF37] transition-colors duration-500">Experiences</NavLink></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-6">Support</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><NavLink to="/contact" className="hover:text-[#D4AF37] transition-colors duration-500">Contact Us</NavLink></li>
              <li><NavLink to="/faq" className="hover:text-[#D4AF37] transition-colors duration-500">FAQ</NavLink></li>
              <li><NavLink to="/privacy" className="hover:text-[#D4AF37] transition-colors duration-500">Privacy Policy</NavLink></li>
              <li><NavLink to="/terms" className="hover:text-[#D4AF37] transition-colors duration-500">Terms of Service</NavLink></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#F9F8F6]/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] uppercase tracking-[0.2em] text-[#6C6863]">
          <p>© {new Date().getFullYear()} The Lumière Estate. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F9F8F6] transition-colors duration-500">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F9F8F6] transition-colors duration-500">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F9F8F6] transition-colors duration-500">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
